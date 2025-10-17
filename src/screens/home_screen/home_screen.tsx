import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Easing,
    Image,
    Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
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
import { ACTIVITIES_POST, JOURNAL_POST, QUESTIONS_GET, QUESTIONS_POST } from "../../services/api_endpoint";
import { useSelector } from "react-redux";
import { RootState } from "../../services/redux/store";

// ⬇️ Imported New Components
import QuestionText from "./components/question_text";
import QuestionRing from "./components/question_ring";
import QuestionSlider from "./components/question_slider";
import NextButton from "./components/next_button";
import Toast from "react-native-toast-message";
import ActivitiesChip from "./components/activities_chip";
import CheckInButton, { toAmPm, useCheckinGates } from "./components/check_in_button";
import JournalEntry from "./components/journal_entry";
import HistorySection from "./components/history_section";
import FirstQuestionRing from "./components/first_question_ring";
import AppButton from "../../componets/app_button";

import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";

import AsyncStorage from "@react-native-async-storage/async-storage";

const viewShotRef = React.createRef<any>();

const handleShare = async () => {
    // AsyncStorage.clear();
    if (!viewShotRef.current) return;

    try {
        const base64Image = await viewShotRef.current.capture();
        await Share.open({
            title: "My Check-in Screenshot",
            url: `data:image/png;base64,${base64Image}`,
            message: "Check out my check-in progress!",
        });
    } catch (err) {
        console.log("Share error:", err);
        CustomToast({ text: "Failed to share screenshot", toastType: "error" });
    }
};

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

const radiusForIndex = (i: number) => (RING_SIZE - STROKE_WIDTH) / 2 - i * RING_GAP;
const circumference = (r: number) => 2 * Math.PI * r;

const ringIndexForQuestion = (questionIdx: number) => {
    let logicalIdx = questionIdx - 1;
    if (questionIdx > 2) logicalIdx -= 1;
    return RING_COUNT - 1 - logicalIdx;
};

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { userData } = useSelector((state: RootState) => state.user);
    const [index, setIndex] = useState(0);
    const [apiQuestions, setApiQuestions] = useState<ApiQuestion[]>([]);
    const [value, setValue] = useState<number>(1);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [journal, setJournal] = useState<string>('');
    const [journalError, setJournalError] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');

    const isoToday = new Date().toISOString().split('T')[0];
    const isToday = !selectedDate || selectedDate === isoToday;

    const morningHHMM = userData?.morning_checkin || "07:00";
    const eveningHHMM = userData?.evening_checkin || "17:00";

    const { showMorning, morningEnabled, eveningEnabled } = useCheckinGates(
        morningHHMM,
        eveningHHMM
    );

    const isEnabled = showMorning ? morningEnabled : eveningEnabled;

    const dynamicTitle = showMorning
        ? isEnabled
            ? "BEGIN YOUR EVENING CHECK-IN"
            : `MORNING CHECK-IN AT ${toAmPm(morningHHMM)}`
        : isEnabled
            ? "BEGIN YOUR EVENING CHECK-IN"
            : `EVENING CHECK-IN AT ${toAmPm(eveningHHMM)}`;

    // Animated ring offsets
    const ringOffsets = useRef(
        Array.from({ length: RING_COUNT }, () => new Animated.Value(0))
    ).current;

    const [ringColors, setRingColors] = useState<string[]>(
        Array.from({ length: RING_COUNT }, () => Colors.ringColor)
    );

    const committedOffsets = useRef<number[]>(
        Array.from({ length: RING_COUNT }, () => 0)
    ).current;
    const committedColors = useRef<string[]>(
        Array.from({ length: RING_COUNT }, () => Colors.ringColor)
    ).current;

    const successScale = useRef(new Animated.Value(0.95)).current;
    const [showSuccess, setShowSuccess] = useState(false);
    const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const successOpacity = useRef(new Animated.Value(0)).current;

    const playTwoSecondPulse = () => {
        successScale.setValue(0.95);
        successOpacity.setValue(1);
        Animated.parallel([
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
            ]),
            Animated.sequence([
                Animated.timing(successOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(successOpacity, {
                    toValue: 0,
                    duration: 300,
                    delay: 1700,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => setShowSuccess(false));
    };

    useEffect(() => {
        return () => {
            if (successTimer.current) clearTimeout(successTimer.current);
        };
    }, []);

    useEffect(() => {
        if (index === 1) {
            setShowSuccess(true);
            playTwoSecondPulse();
            if (successTimer.current) clearTimeout(successTimer.current);
            successTimer.current = setTimeout(() => setShowSuccess(false), 2000);
        }
    }, [index]);

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

    const uiQuestions: UiQuestion[] = useMemo(() => {
        const welcome: UiQuestion = {
            id: "static-welcome",
            Question: `Good Morning ${userData?.name}, \nStart your day with a check-in.`,
            Slider: false,
            Button: true,
            type: "static",
        };

        const dynamics: UiQuestion[] = apiQuestions.map((q) => {
            if (q.type === "scale" && q.scale_options?.length) {
                const options = [...q.scale_options].sort((a, b) => a.display_order - b.display_order);
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

        const completion: UiQuestion = {
            id: "static-complete",
            Question: `Have a great day ${userData?.name}.\nYour Morning Check-in is complete.`,
            Slider: false,
            Button: false,
            type: "static",
        };
        dynamics.splice(1, 0, completion);

        const journalPrompt: UiQuestion = {
            id: "static-journal",
            Question: `Your Check-In is complete.\nMake a journal entry.`,
            Slider: false,
            Button: true,
            type: "static",
        };

        const finalCompletion: UiQuestion = {
            id: "static-final-complete",
            Question: `Great job on completing\nyour check-ins for the day!`,
            Slider: false,
            Button: false,
            type: "static",
        };

        return [welcome, ...dynamics, journalPrompt, finalCompletion];
    }, [apiQuestions]);

    // ✅ Load completion from AsyncStorage
    useEffect(() => {
        const loadCompletion = async () => {
            const completedDate = await AsyncStorage.getItem('morningCheckInCompleted');
            const today = new Date().toISOString().split('T')[0];
            if (completedDate === today) {
                const finalIndex = uiQuestions.findIndex(q => q.id === "static-final-complete");
                setIndex(finalIndex);
            }
        };
        loadCompletion();
    }, [uiQuestions]);

    // Optional: reset next day
    useEffect(() => {
        const resetCheckIn = async () => {
            const completedDate = await AsyncStorage.getItem('morningCheckInCompleted');
            const today = new Date().toISOString().split('T')[0];
            if (completedDate && completedDate !== today) {
                await AsyncStorage.removeItem('morningCheckInCompleted');
                setIndex(0);
            }
        };
        resetCheckIn();
    }, []);

    const current = uiQuestions[index];

    useEffect(() => {
        if (index > 0 && current?.Slider && current.min != null) {
            setValue(current.min);
        }
    }, [index, current]);

    const ratio = useMemo(() => {
        const v = typeof value === "number" ? value + 1 : 1;
        return Math.max(0, Math.min(1, (v - 1) / 5));
    }, [value]);

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

    useEffect(() => {
        if (index !== 0 && index !== 2 && index !== 6 && index !== 7) {
            for (let i = 0; i < RING_COUNT; i++) {
                ringOffsets[i].setValue(committedOffsets[i]);
            }
            setRingColors(prev => {
                const next = [...prev];
                for (let i = 0; i < RING_COUNT; i++) next[i] = committedColors[i];
                return next;
            });
        }
    }, [index]);

    useEffect(() => {
        if (index === 0 || index === 2) return;
        const rIdx = ringIndexForQuestion(index);
        if (rIdx < 0 || rIdx >= RING_COUNT) return;

        const r = radiusForIndex(rIdx);
        const circ = circumference(r);
        const target = circ * (1 - ratio);

        setRingColors((prev) => {
            if (prev[rIdx] === currentOptionColor) return prev;
            const next = [...prev];
            next[rIdx] = currentOptionColor;
            return next;
        });

        Animated.timing(ringOffsets[rIdx], {
            toValue: target,
            duration: 350,
            useNativeDriver: false,
        }).start(() => {
            committedOffsets[rIdx] = target;
            committedColors[rIdx] = currentOptionColor;
        });
    }, [value, index, ratio, currentOptionColor]);

    const outerRadius = radiusForIndex(RING_COUNT - 1);
    const outerCirc = circumference(outerRadius);
    const ringOffset = useRef(new Animated.Value(outerCirc)).current;
    const [ringColor, setRingColor] = useState(Colors.blueColor);

    useEffect(() => {
        if (!current?.Slider) return;
        const ratio = Math.max(0, Math.min(1, value / (current.max ?? 5)));
        const offset = outerCirc * (1 - ratio);
        Animated.timing(ringOffset, {
            toValue: offset,
            duration: 300,
            useNativeDriver: false,
        }).start();

        const nearestOption = current.options?.reduce((acc, opt) => {
            const dist = Math.abs((value ?? 0) - opt.value);
            return dist < acc.dist ? { opt, dist } : acc;
        }, { opt: current.options?.[0], dist: Infinity }).opt;

        if (nearestOption) setRingColor(nearestOption.color_hex);
    }, [value, outerCirc]);

    const questionMutation = useMutation({
        mutationFn: async (formData: any) => {
            const { data } = await QUESTIONS_POST(formData);
            return data;
        },
        onError: (error: any) => { },
    });

    const activitiesMutation = useMutation({
        mutationFn: async (formData: any) => {
            const { data } = await ACTIVITIES_POST(formData);
            return data;
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message, toastType: "error" });
        },
    });

    const journalMutation = useMutation({
        mutationFn: async (formData: any) => {
            const { data } = await JOURNAL_POST(formData);
            return data;
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message, toastType: "error" });
        },
    });

    const handleNext = async () => {
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 160, useNativeDriver: true }),
        ]).start(async () => {
            if (index < uiQuestions.length) {

                // Commit first sleep question to main QuestionRing
                if (index === 1) {
                    const firstRingIdx = ringIndexForQuestion(1);
                    const r = radiusForIndex(firstRingIdx);
                    const circ = circumference(r);
                    const sleepQuestion = uiQuestions[1];
                    const sleepRatio = Math.max(
                        0,
                        Math.min(
                            1,
                            ((value ?? sleepQuestion.min ?? 1) - (sleepQuestion.min ?? 1)) /
                            ((sleepQuestion.max ?? 5) - (sleepQuestion.min ?? 1))
                        )
                    );
                    const targetOffset = circ * (1 - sleepRatio);
                    committedOffsets[firstRingIdx] = targetOffset;
                    committedColors[firstRingIdx] = currentOptionColor;
                    ringOffsets[firstRingIdx].setValue(targetOffset);
                }

                // Question submission
                if (index > 0 && index < 6) {
                    const currentQuestion = uiQuestions[index];
                    const payload = {
                        answer: value,
                        question_id: currentQuestion.id,
                        date: new Date().toISOString().split('T')[0],
                    };
                    questionMutation.mutate(payload);
                }

                if (index === 7) {
                    const payload = {
                        activity_ids: selectedActivities,
                        date: new Date().toISOString().split('T')[0],
                    };
                    activitiesMutation.mutate(payload);
                }

                if (index === 8) {
                    const empty = !journal.trim();
                    if (empty) {
                        setJournalError(true);
                        return;
                    }
                    setJournalError(false);
                    const payload = {
                        entry: journal,
                        date: new Date().toISOString().split('T')[0],
                    };
                    journalMutation.mutate(payload);

                    // ✅ Persist morning check-in completed
                    await AsyncStorage.setItem('morningCheckInCompleted', new Date().toISOString().split('T')[0]);
                }

                setIndex((p) => p + 1);
            }
        });
    };

    return (
        <View style={[GlobalStyles.mainContainer, GlobalStyles.startVertical]}>
            <HeaderCalendar onDateChange={(date) => setSelectedDate(date)} />

            {!isToday ? (
                <>
                    <SizeBox height={40} />
                    <QuestionText fadeAnim={fadeAnim} text={`Great job on completing\nyour check-ins for the day !`} />
                    <SizeBox flex={1} />
                    <HistorySection date={selectedDate} />
                    <SizeBox flex={1} />
                </>
            ) : (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[HomeStyles.secondContainer, { alignItems: "center" }]}>
                        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1, result: "base64" }} style={[HomeStyles.secondContainer, { alignItems: "center" }]}>
                            {index !== 10 && <QuestionText fadeAnim={fadeAnim} text={current?.Question} />}
                            {(index !== 7 && index !== 8) && <SizeBox flex={1} />}

                            {index === 0 ? (
                                <>
                                    <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
                                        <Image source={Images.addRingImage} style={HomeStyles.ringImage} />
                                    </TouchableOpacity>
                                    <SizeBox height={30} />
                                </>
                            ) : index === 2 ? (
                                <FirstQuestionRing
                                    firstRingColor={ringColor}
                                    firstRingOffset={ringOffset}
                                    totalRings={RING_COUNT}
                                />
                            ) : index === 7 ? (
                                <ActivitiesChip
                                    onSelect={(activities) => {
                                        const ids = Array.isArray(activities)
                                            ? activities.map((a) => typeof a === "string" ? a : a.id)
                                            : [];
                                        setSelectedActivities(ids);
                                    }}
                                    selectedIds={[]}
                                />
                            ) : index === 8 ? (
                                <JournalEntry
                                    onChange={(text) => setJournal(text)}
                                    error={journalError}
                                />
                            ) : (
                                <>
                                    <QuestionRing
                                        ringColors={ringColors}
                                        ringOffsets={ringOffsets}
                                        showSuccess={showSuccess}
                                        successScale={successScale}
                                    />
                                    {showSuccess && (
                                        <Animated.Image
                                            source={Images.successRingImage}
                                            style={[
                                                HomeStyles.successRingImage,
                                                {
                                                    opacity: successOpacity,
                                                    transform: [{ scale: successScale }],
                                                },
                                            ]}
                                            resizeMode="contain"
                                        />
                                    )}
                                </>
                            )}

                            <SizeBox flex={1} />

                            {(index !== 7 && current?.Slider) && (
                                <QuestionSlider
                                    value={value}
                                    setValue={setValue}
                                    min={current.min ?? 1}
                                    max={current.max ?? 5}
                                    currentOptionColor={currentOptionColor}
                                />
                            )}

                            {(index === 9) && (
                                <>
                                    <AppButton
                                        text="Share"
                                        onPress={handleShare}
                                    />
                                    <SizeBox height={40} />
                                </>
                            )}

                            <NextButton onPress={handleNext} visible={index !== 0 && current?.Button} />

                            <CheckInButton
                                title={dynamicTitle}
                                onPress={handleNext}
                                disabled={showMorning ? !morningEnabled : !eveningEnabled}
                                visible={index === 2}
                            />

                        </ViewShot>
                    </View>
                </TouchableWithoutFeedback>
            )}

            <Toast />
        </View>
    );
};

export default HomeScreen;