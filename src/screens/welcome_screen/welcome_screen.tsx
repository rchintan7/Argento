import React, { useEffect, useState } from "react";
import { Image, Platform, Text, View } from "react-native";
import GlobalStyles from "../../constants/global_styles";
import { Images } from "../../constants/images";
import WelcomeStyles from "./styles";
import SizeBox from "../../constants/sizebox";
import AppButton from "../../componets/app_button";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { jwtDecode } from 'jwt-decode';
import { saveAppleKeyInAsync } from "../../services/config/async";
import auth from "@react-native-firebase/auth";
import { CustomToast } from "../../utils/toast";
import Toast from "react-native-toast-message";

interface WelcomeScreenProps {
    navigation: {
        dispatch(arg0: any): unknown;
        navigate: (screen: string, params?: any) => void;
    };
}

type AppleTokenPayload = {
    iss: string;
    aud: string;
    exp: number;
    iat: number;
    sub: string;
    email?: string;
    email_verified?: string;
    is_private_email?: string;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
    const [googleLoading, setGoogleLoading] = useState(false);
    const [appleLoading, setAppleLoading] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'android') {
            GoogleSignin.configure();
        } else {
            GoogleSignin.configure({
                webClientId: '596921374194-v8joiehu1p86hjjar00hmpo1s4lqmmiu.apps.googleusercontent.com'
            });
        }
    }, [])

    // ✅ GOOGLE LOGIN
    const onGooglePress = async () => {
        try {
            setGoogleLoading(true);
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            const email = userInfo?.data?.user?.email;
            const firebaseUID = userInfo?.data?.idToken;

            if (email) {
                CustomToast({
                    text: "Google Sign-In successful",
                    toastType: "success"
                });
                setTimeout(() => {
                    navigation.navigate("ActivateExperience", {
                        email,
                        firebase_uid: firebaseUID,
                    });
                }, 500);
            }
        } catch (error: any) {
            CustomToast({
                text: "Google Sign-In error",
                subText: `${error}`,
                toastType: "error"
            });
            console.error("Google Sign-In error:", error);
        } finally {
            setGoogleLoading(false);
        }
    };

    // ✅ APPLE LOGIN
    const onApplePress = async () => {
        try {
            setAppleLoading(true);

            const appleAuthResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            const { identityToken, email, user } = appleAuthResponse;

            if (identityToken) {
                await saveAppleKeyInAsync("appleKey", user);
                const decoded: AppleTokenPayload = jwtDecode(identityToken);
                // const appleCredential = auth.AppleAuthProvider.credential(identityToken);
                // const userSignIn = await auth().signInWithCredential(appleCredential);

                const finalEmail = email || decoded.email;
                const firebaseUID = identityToken;

                if (finalEmail) {
                    CustomToast({
                        text: "Apple Sign-In successful",
                        toastType: "success"
                    });
                    navigation.navigate("ActivateExperience", {
                        email: finalEmail,
                        firebase_uid: firebaseUID,
                    });
                }
            } else {
                CustomToast({
                    text: "Apple Sign-In failed",
                    subText: "No identity token returned",
                    toastType: "error"
                });
                console.error("Apple Sign-In failed: no identity token returned");
            }
        } catch (error: any) {
            CustomToast({
                text: "Apple Sign-In error",
                subText: `${error}`,
                toastType: "error"
            });
            console.error("Apple Sign-In error:", error);
        } finally {
            setAppleLoading(false);
        }
    };

    return (
        <View style={[GlobalStyles.mainContainer, GlobalStyles.center]}>
            <Image
                source={Images.splashImage}
                style={WelcomeStyles.image}
            />
            <SizeBox height={24} />
            <Text style={WelcomeStyles.text}>{'ACCESS ARGENTO'}</Text>
            {/* Continue / Next Button */}
            <SizeBox height={40} />
            <View style={WelcomeStyles.nextButtonView}>
                <AppButton
                    text={"Continue with Google"}
                    onPress={() => {
                        // navigation.navigate("ActivateExperience", {
                        //     // email: finalEmail,
                        //     // firebase_uid: firebaseUID,
                        // });
                        onGooglePress();
                    }}
                    loading={googleLoading}
                />
                <SizeBox height={20} />
                <AppButton
                    text={"Continue with Apple"}
                    onPress={() => {
                        onApplePress();
                    }}
                    loading={appleLoading}
                />
            </View>
            <Toast />
        </View>
    );
};

export default WelcomeScreen;