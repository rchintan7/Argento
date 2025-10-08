import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    View,
    Platform,
} from "react-native";
import GlobalStyles from "../../constants/global_styles";
import { Images } from "../../constants/images";
import SizeBox from "../../constants/sizebox";
import AppButton from "../../componets/app_button";
import ActivateStyles from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInputBox from "../../componets/text_input_box";
import ToggleSwitch from "toggle-switch-react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Colors from "../../constants/colors";

interface ActivateExperienceProps {
    navigation: {
        dispatch(arg0: any): unknown;
        navigate: (screen: string) => void;
    };
}

const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
];

const ActivateExperience: React.FC<ActivateExperienceProps> = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    // 🔹 States
    const [gender, setGender] = useState<string | null>(null);
    const [morningTime, setMorningTime] = useState("9:00 AM");
    const [eveningTime, setEveningTime] = useState("7:00 PM");
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedField, setSelectedField] = useState<"morning" | "evening" | null>(null);

    // Switches
    const [cameraAccess, setCameraAccess] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [storage, setStorage] = useState(true);

    // 🔹 Time Picker Handler
    const handleConfirm = (date: Date) => {
        const timeString = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        if (selectedField === "morning") setMorningTime(timeString);
        else if (selectedField === "evening") setEveningTime(timeString);

        setShowTimePicker(false);
    };

    return (
        <View style={[GlobalStyles.mainContainer, GlobalStyles.startVertical]}>
            <View style={ActivateStyles.headerView}>
                <Text style={[ActivateStyles.headerText, { paddingTop: insets.top }]}>
                    {"WELCOME TO ARGENTO"}
                </Text>
            </View>

            <KeyboardAvoidingView
                style={[GlobalStyles.scrollContainer, ActivateStyles.nextButtonView]}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <SizeBox height={24} />
                    <Text style={ActivateStyles.text}>{"ACCESS ARGENTO"}</Text>

                    <SizeBox height={24} />
                    <Text style={ActivateStyles.subtitle}>
                        {
                            "A few essential details to personalize your Argento experience and ensure your tracking is perfectly calibrated for peak performance."
                        }
                    </Text>

                    <SizeBox height={40} />

                    <TextInputBox placeholder="Name" />
                    <SizeBox height={16} />
                    <TextInputBox placeholder="Age" keyboardType="number-pad" />
                    <SizeBox height={16} />

                    {/* 🔹 Gender Dropdown */}
                    <Dropdown
                        style={ActivateStyles.dropdown}
                        placeholderStyle={{ color: Colors.placHolder }}
                        selectedTextStyle={{ color: Colors.whiteColor }}
                        data={genderOptions}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Gender"
                        value={gender}
                        onChange={(item) => setGender(item.value)}
                    />

                    <SizeBox height={24} />
                    <Text style={ActivateStyles.labelText}>Check-in Preferences</Text>
                    <SizeBox height={24} />

                    {/* 🔹 Morning Check-in */}
                    <TextInputBox
                        value={morningTime}
                        placeholder="Morning Check-in"
                    // editable={false}
                    // onPressIn={() => {
                    //     setSelectedField("morning");
                    //     setShowTimePicker(true);
                    // }}
                    />
                    <SizeBox height={16} />

                    {/* 🔹 Evening Check-in */}
                    <TextInputBox
                        value={eveningTime}
                        placeholder="Evening Check-in"
                    // editable={false}
                    // onPressIn={() => {
                    //     setSelectedField("evening");
                    //     setShowTimePicker(true);
                    // }}
                    />

                    {/* 🔹 Time Picker Modal */}
                    <DateTimePickerModal
                        isVisible={showTimePicker}
                        mode="time"
                        onConfirm={handleConfirm}
                        onCancel={() => setShowTimePicker(false)}
                    />

                    <SizeBox height={24} />
                    <Text style={ActivateStyles.labelText}>Permissions</Text>
                    <SizeBox height={24} />

                    {/* 🔹 Switches */}
                    <View style={ActivateStyles.switchRow}>
                        <Text style={ActivateStyles.swichLabelText}>Camera Access</Text>
                        <ToggleSwitch
                            isOn={cameraAccess}
                            onColor="green"
                            offColor="grey"
                            size="medium"
                            onToggle={setCameraAccess}
                        />
                    </View>
                    <View style={ActivateStyles.switchRow}>
                        <Text style={ActivateStyles.swichLabelText}>Notifications</Text>
                        <ToggleSwitch
                            isOn={notifications}
                            onColor="green"
                            offColor="grey"
                            size="medium"
                            onToggle={setNotifications}
                        />
                    </View>
                    <View style={ActivateStyles.switchRow}>
                        <Text style={ActivateStyles.swichLabelText}>Storage</Text>
                        <ToggleSwitch
                            isOn={storage}
                            onColor="green"
                            offColor="grey"
                            size="medium"
                            onToggle={setStorage}
                        />
                    </View>

                    <SizeBox height={40} />

                    <AppButton
                        text={"Continue"}
                        onPress={() => {
                            console.log({
                                gender,
                                morningTime,
                                eveningTime,
                                cameraAccess,
                                notifications,
                                storage,
                            });
                            navigation.navigate("SecureEliteAccess");
                        }}
                    />
                    <SizeBox height={40} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ActivateExperience;
