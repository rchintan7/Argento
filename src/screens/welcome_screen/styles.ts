import { StyleSheet } from "react-native";
import Fonts from "../../constants/fonts";
import Colors from "../../constants/colors";

const WelcomeStyles = StyleSheet.create({
    image: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    text: {
        fontSize: 28,
        fontFamily: Fonts.Bold,
        color: Colors.whiteColor,
        lineHeight: 40
    },
    nextButtonView: {
        paddingHorizontal: 30,
        width: '100%'
    },
});

export default WelcomeStyles;