import { StyleSheet } from "react-native";
import Fonts from "../../constants/fonts";
import Colors from "../../constants/colors";

const SplashStyles = StyleSheet.create({
    spalashImage: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
    },
    splashText: {
        fontSize: 40,
        fontFamily: Fonts.Bold,
        color: Colors.whiteColor,
        lineHeight: 40
    },
});

export default SplashStyles;