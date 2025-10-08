import React, { } from "react";
import { View } from "react-native";
import GlobalStyles from "../../constants/global_styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface JournalScreenProps {
    navigation: {
        dispatch(arg0: any): unknown;
        navigate: (screen: string) => void;
    };
}

const JournalScreen: React.FC<JournalScreenProps> = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[GlobalStyles.mainContainer, GlobalStyles.startVertical]}>
        </View>
    );
};

export default JournalScreen;