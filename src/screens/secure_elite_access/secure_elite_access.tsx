import React, { } from "react";
import { KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import GlobalStyles from "../../constants/global_styles";
import SizeBox from "../../constants/sizebox";
import AppButton from "../../componets/app_button";
import SecureEliteAccessStyles from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../constants/colors";

interface SecureEliteAccessProps {
    navigation: {
        dispatch(arg0: any): unknown;
        navigate: (screen: string) => void;
    };
}

const plans = [
    {
        id: 1,
        title: "Argento Select",
        price: "$9.99",
        duration: "/month",
        value: ""
    },
    {
        id: 2,
        title: "Argento Elevated",
        price: "$24.99",
        duration: "/quarter",
        value: ""
    },
    {
        id: 3,
        title: "Argento Apex",
        price: "$79.99",
        duration: "/year",
        value: "Best Value"
    },
];

const SecureEliteAccess: React.FC<SecureEliteAccessProps> = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[GlobalStyles.mainContainer, GlobalStyles.startVertical]}>
            <View style={SecureEliteAccessStyles.headerView}>
                <Text style={[SecureEliteAccessStyles.headerText, { paddingTop: insets.top }]}>{'LET’S LOCK IN'}</Text>
            </View>

            <KeyboardAvoidingView style={[GlobalStyles.scrollContainer, SecureEliteAccessStyles.nextButtonView]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Title */}
                    <SizeBox height={20} />
                    <Text style={SecureEliteAccessStyles.text}>{'Secure Your Elite Access'}</Text>

                    {/* Subtitle */}
                    <SizeBox height={20} />
                    <Text style={SecureEliteAccessStyles.subtitle}>{'Your curated experience demands proprietary tools. Unlock the full power of Argento with an exclusive membership.'}</Text>
                    <SizeBox height={20} />
                    <Text style={[SecureEliteAccessStyles.subtitle, { color: Colors.placHolder }]}>{'Cancel anytime. Terms and conditions apply.'}</Text>
                    <SizeBox height={20} />
                    {
                        plans.map((item) => {
                            return (
                                <View style={SecureEliteAccessStyles.planContainer}>
                                    <View style={SecureEliteAccessStyles.rowView}>
                                        <Text style={SecureEliteAccessStyles.planTitle}>{item.title}</Text>
                                        {
                                            item.value && <View style={SecureEliteAccessStyles.valueView}>
                                                <Text style={SecureEliteAccessStyles.valueText}>{item.value}</Text>
                                            </View>
                                        }
                                    </View>
                                    <SizeBox height={10} />
                                    <Text style={SecureEliteAccessStyles.planPrice}>{item.price}<Text style={SecureEliteAccessStyles.planTitle}> {item.duration}</Text></Text>
                                    <SizeBox height={16} />
                                    <TouchableOpacity style={SecureEliteAccessStyles.planButtonContainer}>
                                        <Text style={SecureEliteAccessStyles.planTitle}>{'Select'}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    }

                    <SizeBox height={10} />
                    <AppButton
                        text={"Activate Membership"}
                        onPress={() => {
                            navigation.navigate('BottomTabs');
                        }}
                    />
                    <SizeBox height={40} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default SecureEliteAccess;