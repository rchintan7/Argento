import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import GlobalStyles from "../../constants/global_styles";
import HomeStyles from "./styles";
import Colors from "../../constants/colors";
import { Images, Svgs } from "../../constants/images";
import { Slider } from "@miblanchard/react-native-slider";
import SizeBox from "../../constants/sizebox";
import HeaderCalendar from "./components/header_calendar";
import { useMutation } from "@tanstack/react-query";
import { CustomToast } from "../../utils/toast";
import { QUESTIONS_GET } from "../../services/api_endpoint";

const { width } = Dimensions.get("window");

// API types
interface ApiScaleOption {
    value: number;
    label: string;
    color_hex: string;
    display_order: number;
}
interface ApiQuestion {
    id: string;
    topic: string;
    question_text: string;
    type: "scale" | "array" | "text" | string;
    scale_options?: ApiScaleOption[];
    display_order: number;
}
type UiQuestion = {
    id: string;
    Question: string;
    Slider: boolean;
    Button: boolean;
    min?: number;
    max?: number;
    options?: ApiScaleOption[];
    type: string;
};

// Geometry and look
const RING_COUNT = 5;
const RING_SIZE = 200;
const STROKE_WIDTH = 3;
const RING_GAP = 12;
const TRACK_OPACITY = 0.2;

const radiusForIndex = (i: number) => {
    const outer = (RING_SIZE - STROKE_WIDTH) / 2;
    return outer - i * RING_GAP;
};
const circumference = (r: number) => 2 * Math.PI * r;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Inside-out mapping: first question (index 1) => innermost ring (i=4)
const ringIndexForQuestion = (questionIdx: number) => {
    const qIdx = Math.max(1, Math.min(RING_COUNT, questionIdx)); // clamp 1..5
    return RING_COUNT - qIdx; // 1->4, 2->3, 3->2, 4->1, 5->0
};

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [index, setIndex] = useState(0); // 0 welcome, 1..5 questions
    const [apiQuestions, setApiQuestions] = useState<ApiQuestion[]>([]);
    const [value, setValue] = useState<number>(1);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Per-ring dashoffset animation
    const ringOffsets = useRef(
        Array.from({ length: RING_COUNT }, () => new Animated.Value(0))
    ).current;

    // Use state for colors so stroke updates re-render
    const [ringColors, setRingColors] = useState<string[]>(
        Array.from({ length: RING_COUNT }, () => Colors.primaryColor)
    );

    useEffect(() => {
        questionsMutation.mutate();
    }, []);

    const questionsMutation = useMutation({
        mutationFn: async () => {
            const { data } = await QUESTIONS_GET();
            return data as ApiQuestion[];
        },
        onSuccess: (data) => {
            const sorted = [...data].sort(
                (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
            );
            setApiQuestions(sorted.slice(0, RING_COUNT));
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message, toastType: "error" });
        },
    });

    const uiQuestions: UiQuestion[] = useMemo(() => {
        const welcome: UiQuestion = {
            id: "static-welcome",
            Question: "Good Morning Kasiel, \nStart your day with a check-in.",
            Slider: false,
            Button: true,
            type: "static",
        };
        const dynamics = apiQuestions.map((q) => {
            if (q.type === "scale" && q.scale_options?.length) {
                const options = [...q.scale_options].sort(
                    (a, b) => a.display_order - b.display_order
                );
                return {
                    id: q.id,
                    Question: q.question_text,
                    Slider: true,
                    Button: true,
                    min: Math.min(...options.map((o) => o.value)),
                    max: Math.max(...options.map((o) => o.value)),
                    options,
                    type: q.type,
                } as UiQuestion;
            }
            return {
                id: q.id,
                Question: q.question_text,
                Slider: false,
                Button: true,
                type: q.type,
            } as UiQuestion;
        });
        return [welcome, ...dynamics];
    }, [apiQuestions]);

    const current = uiQuestions[index];

    // Enter question: reset slider, offsets, and ring colors
    useEffect(() => {
        if (index > 0 && current?.Slider && current.min != null) {
            setValue(current.min);

            // Empty all rings
            for (let i = 0; i < RING_COUNT; i++) {
                const r = radiusForIndex(i);
                const circ = circumference(r);
                ringOffsets[i].setValue(circ);
            }

            // Neutral colors for all rings
            setRingColors(Array.from({ length: RING_COUNT }, () => Colors.primaryColor));
        }
    }, [index, current, ringOffsets]);

    // Ratio for arc length
    const ratio = useMemo(() => {
        const v = typeof value === "number" ? value + 1 : 1;
        return Math.max(0, Math.min(1, (v - 1) / 5));
    }, [value]);

    // Current option color (for ring and slider)
    const currentOptionColor = useMemo(() => {
        const q = uiQuestions[index];
        if (!(q?.options?.length)) return Colors.blueColor;
        const nearest = q.options.reduce(
            (acc, opt) => {
                const dist = Math.abs((value ?? 0) - opt.value);
                return dist < acc.dist ? { opt, dist } : acc;
            },
            { opt: q.options[0], dist: Infinity as number }
        ).opt;
        return nearest?.color_hex ?? Colors.blueColor;
    }, [uiQuestions, index, value]);

    // Update active ring color and arc length
    useEffect(() => {
        if (index === 0) return;
        const rIdx = ringIndexForQuestion(index);

        setRingColors((prev) => {
            if (prev[rIdx] === currentOptionColor) return prev;
            const next = [...prev];
            next[rIdx] = currentOptionColor;
            return next;
        });

        const r = radiusForIndex(rIdx);
        const circ = circumference(r);
        const target = circ * (1 - ratio);

        Animated.timing(ringOffsets[rIdx], {
            toValue: target,
            duration: 350,
            useNativeDriver: false,
        }).start();
    }, [value, index, ratio, currentOptionColor, ringOffsets]);

    const handleNext = () => {
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 160, useNativeDriver: true }),
        ]).start(() => {
            if (index < uiQuestions.length - 1) setIndex((p) => p + 1);
        });
    };

    const Marker = () => <View key={index} style={HomeStyles.stepMarker} />;

    return (
        <View style={[GlobalStyles.mainContainer, GlobalStyles.startVertical]}>
            <HeaderCalendar />

            <View style={[HomeStyles.secondContainer, { alignItems: "center" }]}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={[HomeStyles.questionText, { width: width * 0.85 }]}>
                        <Svgs.rightArrow height={10} width={10} /> {current?.Question}
                    </Text>
                </Animated.View>

                <SizeBox flex={1} />

                {index === 0 ? (
                    <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
                        <Image source={Images.addRingImage} style={HomeStyles.ringImage} />
                    </TouchableOpacity>
                ) : (
                    <View
                        style={{
                            width: RING_SIZE,
                            height: RING_SIZE,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
                            {/* Tracks */}
                            {Array.from({ length: RING_COUNT }).map((_, i) => {
                                const r = radiusForIndex(i);
                                return (
                                    <Circle
                                        key={`track-${i}-${index}`}
                                        cx={RING_SIZE / 2}
                                        cy={RING_SIZE / 2}
                                        r={r}
                                        stroke={Colors.borderColor}
                                        strokeOpacity={TRACK_OPACITY}
                                        strokeWidth={STROKE_WIDTH}
                                        fill="none"
                                    />
                                );
                            })}
                            {/* Arcs */}
                            {Array.from({ length: RING_COUNT }).map((_, i) => {
                                const r = radiusForIndex(i);
                                const circ = circumference(r);
                                const stroke =
                                    i === ringIndexForQuestion(index) ? ringColors[i] : ringColors[i];
                                return (
                                    <AnimatedCircle
                                        key={`arc-${i}-${index}`}
                                        cx={RING_SIZE / 2}
                                        cy={RING_SIZE / 2}
                                        r={r}
                                        stroke={stroke}
                                        strokeWidth={STROKE_WIDTH}
                                        fill="none"
                                        strokeDasharray={`${circ} ${circ}`}
                                        strokeDashoffset={ringOffsets[i] as unknown as number}
                                        strokeLinecap="round"
                                        rotation="-90"
                                        originX={RING_SIZE / 2}
                                        originY={RING_SIZE / 2}
                                    />
                                );
                            })}
                        </Svg>
                    </View>
                )}

                <SizeBox flex={1} />

                {current?.Slider && (
                    <Slider
                        value={value}
                        onValueChange={(v) => setValue(Array.isArray(v) ? v[0] : v)}
                        containerStyle={{ width: width * 0.85 }}
                        maximumTrackTintColor={Colors.sliderColor}
                        minimumTrackTintColor={currentOptionColor}
                        minimumValue={current.min ?? 1}
                        maximumValue={current.max ?? 5}
                        step={1}
                        trackMarks={[1, 2, 3, 4, 5]}
                        thumbStyle={{ height: 19, width: 32, backgroundColor: currentOptionColor }}
                        renderTrackMarkComponent={Marker}
                        animationType="timing"
                    />
                )}

                <SizeBox height={28} />

                {index !== 0 && current?.Button ? (
                    <TouchableOpacity
                        onPress={handleNext}
                        style={[HomeStyles.nextButton, { transform: [{ rotate: "270deg" }] }]}
                        activeOpacity={0.7}
                    >
                        <Svgs.downArrow height={24} width={24} />
                    </TouchableOpacity>
                ) : (
                    <SizeBox height={34} />
                )}
            </View>
        </View>
    );
};

export default HomeScreen;