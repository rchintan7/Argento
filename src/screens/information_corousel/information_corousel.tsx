import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GlobalStyles from "../../constants/global_styles";
import styles from "./styles";
import SizeBox from "../../constants/sizebox";
import { Images } from "../../constants/images";
import AppButton from "../../componets/app_button";

interface InformationCarouselProps {
    navigation: {
        dispatch(arg0: any): unknown;
        navigate: (screen: string) => void;
    };
}

const slides = [
    {
        id: 1,
        title: "TRACK YOUR PROGRESS",
        subtitle: "See how your wellness changes over time with detailed reports and insights.",
        image: Images.introImage,
    },
    {
        id: 2,
        title: "STAY MOTIVATED",
        subtitle: "Get personalized reminders to keep your goals on track.",
        image: Images.introImage,
    },
    {
        id: 3,
        title: "REACH YOUR GOALS",
        subtitle: "Achieve your best self with guided support and progress tracking.",
        image: Images.introImage,
    },
];

const InformationCarousel: React.FC<InformationCarouselProps> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.navigate("WelcomeScreen");
        }
    };

    const currentSlide = slides[currentIndex];

    return (
        <View
            style={[
                GlobalStyles.mainContainer,
                GlobalStyles.startVertical,
                { paddingTop: insets.top },
            ]}
        >
            <SizeBox height={20} />

            {/* Pagination Dots */}
            <View style={styles.dotsContainer}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex && styles.activeDot,
                        ]}
                    />
                ))}
            </View>

            <SizeBox height={30} />

            {/* Title */}
            <Text style={styles.title}>{currentSlide.title}</Text>
            <SizeBox height={30} />

            {/* Subtitle */}
            <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
            <SizeBox height={40} />

            {/* Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={currentSlide.image}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <SizeBox height={40} />

            {/* Continue / Next Button */}
            <View style={styles.nextButtonView}>
                <AppButton onPress={handleNext} text={currentIndex === slides.length - 1 ? "Continue" : "Next"} />
            </View>

            <SizeBox height={insets.bottom + 20} />
        </View>
    );
};

export default InformationCarousel;