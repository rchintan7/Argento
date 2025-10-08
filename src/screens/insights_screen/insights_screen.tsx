import React, { } from "react";
import { View } from "react-native";
import GlobalStyles from "../../constants/global_styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface InsightsScreenProps {
    navigation: {
        dispatch(arg0: any): unknown;
        navigate: (screen: string) => void;
    };
}

const InsightsScreen: React.FC<InsightsScreenProps> = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[GlobalStyles.mainContainer, GlobalStyles.startVertical]}>
        </View>
    );
};

export default InsightsScreen;