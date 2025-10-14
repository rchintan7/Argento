import React, { } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import GlobalStyles from "../../constants/global_styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Google Sign-In
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Apple Sign-In
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { CommonActions } from "@react-navigation/native";
import { clearAllAsync, getAppleKeyFromAsync } from "../../services/config/async";
import { useDispatch } from "react-redux";
import { logout } from "../../services/slices/user.slice";

interface ProfileScreenProps {
    navigation: {
        dispatch(arg0: any): unknown;
        navigate: (screen: string) => void;
    };
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            // 🔹 Google Sign-Out
            const user = await GoogleSignin.getCurrentUser();
            if (user) {
                await GoogleSignin.signOut();
                console.log("Google signed out");
            }

            // 🔹 Apple Sign-Out (Note: Apple doesn't provide a real sign-out, just revoke tokens)
            try {
                const appleUserId = getAppleKeyFromAsync('appleKey');
                const credentialState = await appleAuth.getCredentialStateForUser(`${appleUserId}`);
                if (credentialState === appleAuth.State.AUTHORIZED) {
                    // Token revocation or cleanup if you stored Apple tokens
                    console.log("Apple logout cleanup done");
                }
            } catch (err) {
                console.log("Apple sign-out error:", err);
            }

            await clearAllAsync();
            dispatch(logout());

            // Navigate back to login or welcome screen
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'WelcomeScreen' }],
                })
            );

            Alert.alert("Logout", "You have been logged out successfully.");
        } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Logout Error", "Something went wrong while logging out.");
        }
    };

    return (
        <View style={[GlobalStyles.mainContainer, GlobalStyles.startVertical, GlobalStyles.centerVertical]}>
            <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: 'red', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', padding: 10, borderRadius: 6, }}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileScreen;