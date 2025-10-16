import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";
import QuestionRing from "./question_ring";
import Colors from "../../../constants/colors";
import { useMutation } from "@tanstack/react-query";
import { HISTORY_GET } from "../../../services/api_endpoint";
import { CustomToast } from "../../../utils/toast";
import HomeStyles from "../styles";
import SizeBox from "../../../constants/sizebox";

interface Props {
    date: string;
}

// scale mapping: 1..5 → 0.2..1.0
type ScaleValue = 0 | 1 | 2 | 3 | 4 | 5;
const STEP: Record<ScaleValue, number> = {
    0: 0.0,
    1: 0.2,
    2: 0.4,
    3: 0.6,
    4: 0.8,
    5: 1.0,
};

const toProgress = (value?: number) => {
    const v = Number.isFinite(value as number) ? (value as number) : 0;
    return STEP[v as ScaleValue] ?? 0;
};

const colorForValue = (q: any, v: number, fb: string) => {
    const opt = q?.scale_options?.find((o: any) => o?.value === v);
    return opt?.color_hex ?? fb;
};

// Ring config: index 0 = OUTER, index 4 = INNER
const RINGS = [{ r: 64 }, { r: 52 }, { r: 40 }, { r: 28 }, { r: 16 }];
const C = RINGS.map((x) => 2 * Math.PI * x.r);
const RING_COUNT = RINGS.length;

// Reverse mapping: first question → INNER
const mapRankToIndex = (rank: number, total: number) => {
    const offset = RING_COUNT - total;
    return offset + (total - 1 - rank);
};

const HistorySection: React.FC<Props> = ({ date }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const successScale = useRef(new Animated.Value(0.95)).current;
    const [activities, setActivities] = useState<any[]>([]);

    const ringOffsets = useRef(C.map((c) => new Animated.Value(c))).current;
    const [ringColors, setRingColors] = useState<string[]>(
        Array.from({ length: RING_COUNT }, () => Colors.ringColor)
    );

    const animateTo = (progress: number[]) => {
        const animations = ringOffsets.map((av, i) => {
            const offset = (1 - (progress[i] ?? 0)) * C[i];
            return Animated.timing(av, {
                toValue: offset,
                duration: 900,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            });
        });
        Animated.stagger(80, animations).start();
    };

    const questionsMutation = useMutation({
        mutationFn: async (selectedDate: string) => {
            const { data } = await HISTORY_GET(selectedDate);
            return data;
        },
        onSuccess: (data: any) => {
            const day = Array.isArray(data) ? data[0] : data;
            const answers = Array.isArray(day?.answers) ? day.answers : [];

            setActivities(Array.isArray(day?.activities) ? day.activities : []);

            if (!answers || answers.length === 0) {
                // No data → leave rings empty
                setRingColors(Array.from({ length: RING_COUNT }, () => Colors.ringColor));
                ringOffsets.forEach((av, i) => av.setValue(C[i]));
                setShowSuccess(false);
                return;
            }

            // Sort by display_order
            const sorted = answers
                .filter((a: any) => a?.question?.display_order != null)
                .sort((a: any, b: any) => (a.question.display_order ?? 0) - (b.question.display_order ?? 0));

            const total = Math.min(sorted.length, RING_COUNT);

            const p: number[] = Array(RING_COUNT).fill(0);
            const cols: string[] = Array(RING_COUNT).fill(Colors.ringColor);

            sorted.forEach((entry: any, rank: number) => {
                const idx = mapRankToIndex(rank, total);
                const val: number = entry?.answer ?? 0;
                p[idx] = toProgress(val);
                cols[idx] = colorForValue(entry?.question, val, Colors.ringColor);
            });

            setRingColors(cols);
            animateTo(p);

            const allComplete = p.slice(RING_COUNT - total).every((x) => x > 0);
            setShowSuccess(allComplete);

            if (allComplete) {
                Animated.sequence([
                    Animated.timing(successScale, { toValue: 1.05, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
                    Animated.spring(successScale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
                ]).start();
            }
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message, toastType: "error" });
            setRingColors(Array.from({ length: RING_COUNT }, () => Colors.ringColor));
            ringOffsets.forEach((av, i) => av.setValue(C[i]));
            setShowSuccess(false);
        },
    });

    useEffect(() => {
        // Clear rings immediately on date change
        setRingColors(Array.from({ length: RING_COUNT }, () => Colors.ringColor));
        ringOffsets.forEach((av, i) => av.setValue(C[i]));
        setShowSuccess(false);

        if (date) questionsMutation.mutate(date);
    }, [date]);

    return (
        <>
            <QuestionRing
                ringColors={ringColors}
                ringOffsets={ringOffsets}
                showSuccess={showSuccess}
                successScale={successScale}
            />
            {activities.length > 0 && <SizeBox flex={1} />}
            {activities.length > 0 && <Text style={[HomeStyles.chipText, { alignSelf: 'flex-start', marginLeft: 20 }]}>{'Your Activities :-'}</Text>}
            <SizeBox height={20} />
            <View style={[HomeStyles.chipWraper, { alignSelf: 'flex-start', marginLeft: 20 }]}>
                {activities.length > 0 && (
                    <>
                        {activities.map((act) => (
                            <View style={HomeStyles.chipContainer}>
                                <Text key={act.id} style={HomeStyles.chipText}>
                                    {act.name}
                                </Text>
                            </View>
                        ))}
                    </>
                )}
            </View>
        </>
    );
};

export default HistorySection;