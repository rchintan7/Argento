import { Dimensions, StyleSheet } from "react-native";
import Fonts from "../../constants/fonts";
import Colors from "../../constants/colors";

const { width, height } = Dimensions.get("window");

const InformationCorouselStyles = StyleSheet.create({
    dotsContainer: {
        flexDirection: "row",
    },
    dot: {
        width: 9,
        height: 9,
        borderRadius: 6,
        backgroundColor: Colors.lightGreen,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 6,
        backgroundColor: Colors.whiteColor,
    },
    title: {
        fontSize: 24,
        fontFamily: Fonts.Bold,
        color: Colors.whiteColor,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: Colors.whiteColor,
        textAlign: "center",
        marginHorizontal: 30,
    },
    imageContainer: {
        backgroundColor: "#F8C9AA",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    image: {
        width: width / 1.15,
        height: height / 1.8,
    },
    nextButtonView: {
        paddingHorizontal: 26,
        width: '100%'
    },
});

export default InformationCorouselStyles;