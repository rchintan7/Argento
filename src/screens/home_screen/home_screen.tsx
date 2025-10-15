import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Easing,
    Image,
    TouchableOpacity,
    View,
} from "react-native";
import GlobalStyles from "../../constants/global_styles";
import HomeStyles from "./styles";
import Colors from "../../constants/colors";
import { Images } from "../../constants/images";
import SizeBox from "../../constants/sizebox";
import HeaderCalendar from "./components/header_calendar";
import { useMutation } from "@tanstack/react-query";
import { CustomToast } from "../../utils/toast";
import { QUESTIONS_GET, QUESTIONS_PUT } from "../../services/api_endpoint";
import { useSelector } from "react-redux";
import { RootState } from "../../services/redux/store";

// ⬇️ Imported New Components
import QuestionText from "./components/question_text";
import QuestionRing from "./components/question_ring";
import QuestionSlider from "./components/question_slider";
import NextButton from "./components/next_button";
import Toast from "react-native-toast-message";
import ActivitiesChip from "./components/activities_chip";

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

// Constants
const RING_COUNT = 5;
const RING_SIZE = 200;
const STROKE_WIDTH = 1.6;
const RING_GAP = 10;

const radiusForIndex = (i: number) => {
    const outer = (RING_SIZE - STROKE_WIDTH) / 2;
    return outer - i * RING_GAP;
};
const circumference = (r: number) => 2 * Math.PI * r;

// Modify the ringIndexForQuestion function to handle 6 questions with 5 rings
const ringIndexForQuestion = (questionIdx: number) => {
    if (questionIdx > RING_COUNT) return RING_COUNT - 1; // Last ring for the 6th question
    const qIdx = Math.max(1, Math.min(RING_COUNT, questionIdx));
    return RING_COUNT - qIdx;
};

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { userData } = useSelector((state: RootState) => state.user);
    const [index, setIndex] = useState(0);
    const [apiQuestions, setApiQuestions] = useState<ApiQuestion[]>([]);
    const [value, setValue] = useState<number>(1);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Animated ring offsets
    const ringOffsets = useRef(
        Array.from({ length: RING_COUNT }, () => new Animated.Value(0))
    ).current;

    // Colors per ring
    const [ringColors, setRingColors] = useState<string[]>(
        Array.from({ length: RING_COUNT }, () => Colors.ringColor)
    );

    // Success animation
    const successScale = useRef(new Animated.Value(0.95)).current;
    const [showSuccess, setShowSuccess] = useState(false);
    const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Fetch questions
    const questionsMutation = useMutation({
        mutationFn: async () => {
            const { data } = await QUESTIONS_GET();
            return data as ApiQuestion[];
        },
        onSuccess: (data) => {
            const sorted = [...data].sort(
                (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
            );
            setApiQuestions(sorted);
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message, toastType: "error" });
        },
    });

    useEffect(() => {
        questionsMutation.mutate();
    }, []);

    // Prepare UI Questions
    const uiQuestions: UiQuestion[] = useMemo(() => {
        const welcome: UiQuestion = {
            id: "static-welcome",
            Question: `Good Morning ${userData?.name}, \nStart your day with a check-in.`,
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

    // Reset slider when question changes
    useEffect(() => {
        if (index > 0 && current?.Slider && current.min != null) {
            setValue(current.min);
        }
    }, [index, current]);

    // Ratio for arc fill
    const ratio = useMemo(() => {
        const v = typeof value === "number" ? value + 1 : 1;
        return Math.max(0, Math.min(1, (v - 1) / 5));
    }, [value]);

    // Get current option color
    const currentOptionColor = useMemo(() => {
        const q = uiQuestions[index];
        if (!q?.options?.length) return Colors.blueColor;
        const nearest = q.options.reduce(
            (acc, opt) => {
                const dist = Math.abs((value ?? 0) - opt.value);
                return dist < acc.dist ? { opt, dist } : acc;
            },
            { opt: q.options[0], dist: Infinity }
        ).opt;
        return nearest?.color_hex ?? Colors.blueColor;
    }, [uiQuestions, index, value]);

    // Animate active ring
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
    }, [value, index, ratio, currentOptionColor]);

    // Pulse animation
    const playTwoSecondPulse = () => {
        successScale.setValue(0.95);
        Animated.sequence([
            Animated.timing(successScale, {
                toValue: 1.1,
                duration: 1000,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(successScale, {
                toValue: 0.95,
                duration: 1000,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start(() => setShowSuccess(false));
    };

    useEffect(() => {
        return () => {
            if (successTimer.current) clearTimeout(successTimer.current);
        };
    }, []);

    // Next button logic
    const handleNext = () => {
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 160, useNativeDriver: true }),
        ]).start(() => {
            if (index < uiQuestions.length) {
                if (index > 0 && index < uiQuestions.length) {
                    const currentQuestion = uiQuestions[index];
                    const payload = {
                        answer: value,
                        question_id: currentQuestion.id,
                        date: new Date().toISOString().split('T')[0]
                    };
                    questionMutation.mutate(payload);
                    setShowSuccess(true);
                    if (successTimer.current) clearTimeout(successTimer.current);
                    playTwoSecondPulse();
                    successTimer.current = setTimeout(() => setShowSuccess(false), 2000);
                }
                setIndex((p) => p + 1);
            }
        });
    };

    const questionMutation = useMutation({
        mutationFn: async (formData: any) => {
            const { data } = await QUESTIONS_PUT(formData);
            return data;
        },
        onSuccess: (data) => {
            // CustomToast({ text: 'Submitted successfully', toastType: 'success' });
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message, toastType: 'error' });
        },
    });

    return (
        <View style={[GlobalStyles.mainContainer, GlobalStyles.startVertical]}>

            {/* Header calendar */}
            <HeaderCalendar />

            <View style={[HomeStyles.secondContainer, { alignItems: "center" }]}>
                {/* Question text */}
                <QuestionText fadeAnim={fadeAnim} text={current?.Question} />

                <SizeBox flex={1} />

                {/* Ring section */}
                {
                    index === 0
                        ? (
                            <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
                                <Image source={Images.addRingImage} style={HomeStyles.ringImage} />
                            </TouchableOpacity>
                        )
                        : index === 6
                            ? (
                                <ActivitiesChip />
                            )
                            : (
                                <QuestionRing
                                    ringColors={ringColors}
                                    ringOffsets={ringOffsets}
                                    showSuccess={showSuccess}
                                    successScale={successScale}
                                />
                            )}

                <SizeBox flex={1} />

                {/* Slider */}
                {current?.Slider && (
                    <QuestionSlider
                        value={value}
                        setValue={setValue}
                        min={current.min ?? 1}
                        max={current.max ?? 5}
                        currentOptionColor={currentOptionColor}
                    />
                )}

                {/* Next button */}
                <NextButton
                    onPress={handleNext}
                    visible={index !== 0 && current?.Button}
                />
            </View>
            <Toast />
        </View>
    );
};

export default HomeScreen;