import React, { useRef, useState } from "react";
import { Animated, Dimensions, Easing, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import GlobalStyles from "../../constants/global_styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeStyles from "./styles";
import { Calendar } from "react-native-calendars";
import Colors from "../../constants/colors";
import { Images, Svgs } from "../../constants/images";
import AnimatedRing from "./components/animated_ring";
import Slider from '@react-native-community/slider';
import SizeBox from "../../constants/sizebox";

interface HomeScreenProps {
    navigation: {
        dispatch(arg0: any): unknown;
        navigate: (screen: string) => void;
    };
}

const { width } = Dimensions.get("window");

const questions = [
    { 'Question': "Good Morning Kasiel, \nStart your day with a check-in.", 'Image': Images.addRingImage, 'Slider': false, 'SliderColor': Colors.primaryColor, 'Button': false },
    { 'Question': "How rested do you feel after \nlast nights sleep?", 'Image': Images.firstRingImage, 'Slider': true, 'SliderColor': Colors.blueColor, 'Button': true },
    { 'Question': "How rested do you feel after \nlast nights sleep?", 'Image': Images.secondRingImage, 'Slider': true, 'SliderColor': Colors.primaryColor, 'Button': true },
    { 'Question': "How rested do you feel after \nlast nights sleep?", 'Image': Images.thirdRingImage, 'Slider': true, 'SliderColor': Colors.orangeColor, 'Button': false },
];

const days = [
    { label: "M", day: "Monday" },
    { label: "T", day: "Tuesday" },
    { label: "W", day: "Wednesday" },
    { label: "T", day: "Thursday" },
    { label: "F", day: "Friday" },
    { label: "S", day: "Saturday" },
    { label: "S", day: "Sunday" },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
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

    const [index, setIndex] = useState(0);
    const [value, setValue] = useState(0.5);
    const [fadeAnim] = useState(new Animated.Value(1));


    const handleNext = () => {
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start(() => {
            if (index < questions.length - 1) {
                setIndex(index + 1);
                setValue(0.5);
            } else {
                // All questions done (you can show summary or success animation)
                console.log("Check-in complete!");
            }
        });
    };

    return (
        <View style={[GlobalStyles.mainContainer, GlobalStyles.startVertical]}>
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
                        markedDates={{
                            [selectedDate]: { selected: true, selectedColor: Colors.primaryColor },
                        }}
                        theme={{
                            calendarBackground: Colors.bottomTabColor,
                            textSectionTitleColor: Colors.placHolder,
                            dayTextColor: Colors.whiteColor,
                            monthTextColor: Colors.primaryColor,
                            arrowColor: Colors.primaryColor,
                            todayTextColor: Colors.primaryColor,
                            selectedDayBackgroundColor: Colors.primaryColor,
                            selectedDayTextColor: Colors.blackColor,
                        }}
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

            <View style={HomeStyles.secondContainer}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={HomeStyles.questionText}><Svgs.rightArrow height={10} width={10} /> {questions[index].Question}</Text>

                    {/* Ring View */}
                    <SizeBox height={100} />
                    <TouchableOpacity onPress={handleNext} disabled={questions[index].Slider}>
                        <Image source={questions[index].Image} style={HomeStyles.ringImage} />
                    </TouchableOpacity>
                    <SizeBox height={80} />
                    {
                        questions[index].Slider && <Slider
                            style={{ width: width * 0.85 }}
                            minimumValue={0}
                            maximumValue={1}
                            step={0.01}
                            value={value}
                            onValueChange={(val) => setValue(val)}
                            minimumTrackTintColor={questions[index].SliderColor}
                            maximumTrackTintColor={Colors.borderColor + 70}
                            thumbTintColor={questions[index].SliderColor}
                        />
                    }
                    <SizeBox height={40} />
                    {
                        questions[index].Button && <TouchableOpacity onPress={handleNext} style={[HomeStyles.nextButton, { transform: [{ rotate: '270deg' }] }]} activeOpacity={0.7}>
                            <Svgs.downArrow height={24} width={24} />
                        </TouchableOpacity>
                    }
                </Animated.View>
            </View>
        </View>
    );
};

export default HomeScreen;