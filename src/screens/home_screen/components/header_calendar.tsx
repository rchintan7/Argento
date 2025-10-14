import React, { useRef, useState } from "react";
import { Animated, View, FlatList, Easing, TouchableOpacity, Text } from "react-native";
import HomeStyles from "../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import Colors from "../../../constants/colors";
import { Svgs } from "../../../constants/images";

interface HeaderCalendarProps {
}

const days = [
    { label: "M", day: "Monday" },
    { label: "T", day: "Tuesday" },
    { label: "W", day: "Wednesday" },
    { label: "T", day: "Thursday" },
    { label: "F", day: "Friday" },
    { label: "S", day: "Saturday" },
    { label: "S", day: "Sunday" },
];

const HeaderCalendar: React.FC<HeaderCalendarProps> = ({ }) => {
    const insets = useSafeAreaInsets();
    const today = new Date();
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const [selectedDay, setSelectedDay] = useState(today.getDay());
    const [selectedDate, setSelectedDate] = useState(
        today.toISOString().split("T")[0]
    );
    const [isExpanded, setIsExpanded] = useState(false);
    const animatedHeight = useRef(new Animated.Value(0)).current;

    const adjustedIndex = selectedDay === 0 ? 6 : selectedDay - 1;

    React.useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: isExpanded ? 1 : 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [isExpanded]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    const toggleCalendar = () => {
        Animated.timing(animatedHeight, {
            toValue: isExpanded ? 0 : 360,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start(() => setIsExpanded(!isExpanded));
    };

    const onDaySelect = (day: any) => {
        setSelectedDate(day.dateString);
        const dateObj = new Date(day.dateString);
        setSelectedDay(dateObj.getDay());
    };

    return (
        <View style={[HomeStyles.headerView, { paddingTop: insets.top }]}>
            {/* WEEK BAR */}
            <View style={HomeStyles.weekContainer}>
                <FlatList
                    horizontal
                    data={days}
                    keyExtractor={(item) => item.day}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        justifyContent: "space-around",
                        flexGrow: 1,
                    }}
                    renderItem={({ item, index }) => {
                        const isSelected = index === adjustedIndex;
                        return (
                            <TouchableOpacity
                                style={[HomeStyles.dayItem, isSelected && HomeStyles.selectedDayItem]}
                                onPress={() => setSelectedDay(index + 1)}
                            >
                                <Text
                                    style={[HomeStyles.dayText, isSelected && HomeStyles.selectedDayText]}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* INLINE CALENDAR */}
            <Animated.View
                style={[
                    HomeStyles.calendarContainer,
                    {
                        height: animatedHeight,
                        opacity: animatedHeight.interpolate({
                            inputRange: [0, 100],
                            outputRange: [0, 1],
                        }),
                    },
                ]}
            >
                <Calendar
                    onDayPress={onDaySelect}
                    monthFormat={'MMMM yyyy'}
                    markedDates={{
                        [selectedDate]: { selected: true, selectedColor: Colors.primaryColor },
                    }}
                    theme={{
                        calendarBackground: Colors.bottomTabColor,
                        textSectionTitleColor: Colors.primaryColor,
                        dayTextColor: Colors.whiteColor,
                        monthTextColor: Colors.primaryColor,
                        arrowColor: Colors.primaryColor,
                        todayTextColor: Colors.primaryColor,
                        selectedDayTextColor: Colors.blackColor,
                        textDayFontWeight: '500',
                        textMonthFontWeight: '600',
                        textDayHeaderFontWeight: '500',
                        textDayFontSize: 14,
                        textMonthFontSize: 16,
                    }}
                    hideExtraDays
                    style={HomeStyles.calendar}
                />
            </Animated.View>

            {/* DOWN ARROW */}
            <TouchableOpacity style={HomeStyles.arrow} onPress={toggleCalendar} activeOpacity={0.7}>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <Svgs.downArrow height={24} width={24} />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

export default HeaderCalendar;