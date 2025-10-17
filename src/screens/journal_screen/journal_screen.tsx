import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import GlobalStyles from "../../constants/global_styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";
import SummaryComponent from "./components/SummaryComponent";
import { useMutation } from "@tanstack/react-query";
import { GET_INSIGHT_CHECKINS, GET_INSIGHTS } from "../../services/api_endpoint";
import { CustomToast } from "../../utils/toast";
import Colors from "../../constants/colors";

interface JournalScreenProps {
    navigation: {
        dispatch(arg0: any): unknown;
        navigate: (screen: string) => void;
    };
}

type DateRange = {
    startdate: string | null;
    todate: string | null;
};

const JournalScreen: React.FC<JournalScreenProps> = ({ navigation }) => {

    const FILTERS = ['Week', 'Month', 'Year', 'All Time'];

    const insets = useSafeAreaInsets();

    const [today] = useState(new Date());
    const [selectedRange, setSelectedRange] = useState('All Time');
    const [expandedSections, setExpandedSections] = useState({ year: false, quarter: false, month: true });
    const [insightsData, setInsightsData] = useState<{
        bars: { metrics: string[]; days: any[]; colors: any[] };
    }>({
        bars: { metrics: [], days: [], colors: [] }
    });
    const [lastDates, setLastDates] = useState({ startdate: null, todate: null });
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        insightsMutation.mutate();
        filterDates();
    }, [selectedRange]);

    const insightsMutation = useMutation({
        mutationFn: async () => {
            const { data } = await GET_INSIGHTS();
            return data;
        },
        onSuccess: (data) => {
            console.log("GET_INSIGHTS====data====", JSON.stringify(data))
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message, toastType: "error" });
        },
    });

    const filterDates = () => {
        let startdate: Date | null = null;
        let todate: Date | null = null;
        if (selectedRange === 'Week') {
            todate = today;
            startdate = new Date(today);
            startdate.setDate(today.getDate() - 6);
        } else if (selectedRange === 'Month') {
            todate = today;
            startdate = new Date(today);
            startdate.setMonth(today.getMonth() - 1);
        } else if (selectedRange === 'Year') {
            todate = today;
            startdate = new Date(today);
            startdate.setFullYear(today.getFullYear() - 1);
        } else if (selectedRange === 'All Time') {
            startdate = null;
            todate = null;
        }

        const formatDate = (date: Date | null) => date ? date.toISOString().split('T')[0] : null;
        insightsCheckins.mutate({
            startdate: formatDate(startdate),
            todate: formatDate(todate),
        });
    };

    const insightsCheckins = useMutation({
        mutationFn: async ({ startdate, todate }: DateRange) => {
            const { data } = await GET_INSIGHT_CHECKINS(startdate, todate);
            return data;
        },
        onSuccess: (data) => {
            if (data) {
                const transformed = transformInsightsData(data);
                setInsightsData(transformed);
            }
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message, toastType: "error" });
        },
    });

    const transformInsightsData = (apiData: any) => {
        const metrics = ['Diet', 'Sleep', 'Activity', 'Mood', 'Stress'];
        const days = apiData?.daily_averages?.map((day: any) => {
            const date = new Date(day?.date);
            return date?.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
        });

        const getColorForValue = (value: any) => {
            if (value >= 4.0) return Colors.primaryColor;
            if (value >= 3.0) return Colors.purple;
            if (value >= 2.0) return Colors.yellow;
            if (value >= 1.0) return Colors.orange;
            return Colors.redColor;
        };

        const colors = apiData?.daily_averages?.map((day: any) => {
            return day?.question_averages?.map((q: any) => getColorForValue(q?.average_response));
        });

        return {
            bars: { metrics, days, colors },
        };
    };

    return (
        <View style={[GlobalStyles.mainContainer, GlobalStyles.startVertical]}>

            <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
                <Text style={styles.header}>AREGNTO INSIGHTS</Text>

                <View style={styles.rangeContainer}>
                    {FILTERS.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[styles.rangeButton, selectedRange === item && styles.rangeButtonActive]}
                            onPress={() => {
                                if (selectedRange === item) return;
                                setSelectedRange(item)
                            }}
                        >
                            <Text style={[styles.rangeText, selectedRange === item && styles.rangeTextActive]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} >

                <SummaryComponent />

                <View style={styles.gridContainer}>
                    <View>
                        {insightsData.bars.metrics.map((metric) => (
                            <View style={{ height: 39, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text key={metric} style={styles.metricLabel}>{metric}</Text>
                            </View>
                        ))}
                    </View>
                    <FlatList
                        data={insightsData?.bars?.days}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        renderItem={({ item, index }) => (
                            <View style={styles.dayColumn}>
                                {insightsData?.bars?.colors[index].map((color: any, i: any) => (
                                    <View key={i} style={[styles.colorBox, { backgroundColor: color }]} />
                                ))}
                                <Text style={styles.dayLabel}>{item}</Text>
                            </View>
                        )}
                        contentContainerStyle={{ width: '85%', paddingHorizontal: 12 }}
                    />
                </View>

                {/* <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>2025</Text>
                    <TouchableOpacity onPress={() => toggleExpand('year')} activeOpacity={0.7}>
                        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                            <Svgs.downArrow height={12} width={12} />
                        </Animated.View>
                    </TouchableOpacity>
                </View> */}

                {/* {expandedSections.year && (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.insightsText}>{'Yearly Insights'}</Text>
                    </View>
                )} */}

                {/* <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Q3</Text>
                    <TouchableOpacity onPress={() => toggleExpand('quarter')} activeOpacity={0.7}>
                        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                            <Svgs.downArrow height={12} width={12} />
                        </Animated.View>
                    </TouchableOpacity>
                </View> */}

                {/* {expandedSections.quarter && (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.insightsText}>{'Quarter Insights'}</Text>
                    </View>
                )} */}

                {/* <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>September</Text>
                    <TouchableOpacity onPress={() => toggleExpand('month')} activeOpacity={0.7}>
                        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                            <Svgs.downArrow height={12} width={12} />
                        </Animated.View>
                    </TouchableOpacity>
                </View> */}

                {/* {expandedSections.month && (
                    <View style={styles.insightList}>
                        <FlatList data={insightsData.insights} renderItem={({ item, index }) => (
                            <View
                                key={item.key}
                                style={styles.insightCard}
                            >
                                <Text
                                    style={styles.insightWeek}>
                                    {item.week} <Text style={styles.insightDate}>{item.date}</Text>
                                </Text>
                                <Text
                                    style={[
                                        styles.insightMessage,
                                        item.type === 'error' && styles.errorText,
                                    ]}
                                >
                                    {item.message}
                                </Text>
                            </View>
                        )} />
                    </View>
                )} */}
            </ScrollView>
        </View>
    );
};

export default JournalScreen;