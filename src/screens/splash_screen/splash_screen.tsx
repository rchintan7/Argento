import React, { useEffect, useRef } from "react";
import { Animated, View, Text, Image } from "react-native";
import GlobalStyles from "../../constants/global_styles";
import SplashStyles from "./styles";
import { Images } from "../../constants/images";
import { CommonActions } from "@react-navigation/native";
import SizeBox from "../../constants/sizebox";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface SplashScreenProps {
    navigation: {
        dispatch(arg0: any): unknown;
        navigate: (screen: string) => void;
    };
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
    const imageOpacity = useRef(new Animated.Value(0)).current;
    const imageTranslateY = useRef(new Animated.Value(-100)).current; // top to center
    const textOpacity = useRef(new Animated.Value(0)).current;
    const textTranslateY = useRef(new Animated.Value(100)).current; // bottom to center

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "596921374194-9m97820ilal66v09cne5nf7j6o8oebh3.apps.googleusercontent.com",
        });
    }, []);

    useEffect(() => {
        Animated.parallel([
            // image: slide down + fade in
            Animated.timing(imageOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(imageTranslateY, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),

            // text: slide up + fade in
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(textTranslateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "InformationCorousel" }],
                })
            );
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={[GlobalStyles.mainContainer, GlobalStyles.center]}>
            <Animated.Image
                source={Images.splashImage}
                style={[
                    SplashStyles.spalashImage,
                    {
                        opacity: imageOpacity,
                        transform: [{ translateY: imageTranslateY }],
                    },
                ]}
            />

            <SizeBox height={30} />

            <Animated.Text
                style={[
                    SplashStyles.splashText,
                    {
                        opacity: textOpacity,
                        transform: [{ translateY: textTranslateY }],
                    },
                ]}
            >
                {"ARGENTO"}
            </Animated.Text>
        </View>
    );
};

export default SplashScreen;