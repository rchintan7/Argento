import React, { } from "react";
import { Image, Text, View } from "react-native";
import GlobalStyles from "../../constants/global_styles";
import { Images } from "../../constants/images";
import WelcomeStyles from "./styles";
import SizeBox from "../../constants/sizebox";
import AppButton from "../../componets/app_button";

interface WelcomeScreenProps {
    navigation: {
        dispatch(arg0: any): unknown;
        navigate: (screen: string) => void;
    };
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {

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
                        navigation.navigate('ActivateExperience');
                    }}
                />
                <SizeBox height={20} />
                <AppButton
                    text={"Continue with Apple"}
                    onPress={() => {
                        navigation.navigate('ActivateExperience');
                    }}
                />
            </View>
        </View>
    );
};

export default WelcomeScreen;