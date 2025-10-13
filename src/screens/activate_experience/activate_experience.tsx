import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    Text,
    View,
    Platform,
    Keyboard,
} from "react-native";
import GlobalStyles from "../../constants/global_styles";
import SizeBox from "../../constants/sizebox";
import AppButton from "../../componets/app_button";
import ActivateStyles from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInputBox from "../../componets/text_input_box";
import ToggleSwitch from "toggle-switch-react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Colors from "../../constants/colors";
import { useMutation } from "@tanstack/react-query";
import { LOGIN_POST } from "../../services/api_endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomToast } from "../../utils/toast";
import { CommonActions } from "@react-navigation/native";

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

    // 🔹 User info
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<string | null>(null);

    // State for errors
    const [nameError, setNameError] = useState('');
    const [ageError, setAgeError] = useState('');
    const [genderError, setGenderError] = useState('');

    // 🔹 Time pickers
    const [morningTime, setMorningTime] = useState("9:00 AM");
    const [eveningTime, setEveningTime] = useState("7:00 PM");
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedField, setSelectedField] = useState<"morning" | "evening" | null>(null);

    // 🔹 Permissions
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

    // Validation function
    const validateFields = () => {
        let hasError = false;

        // Validate Name
        if (!name.trim()) {
            setNameError('Name is required');
            hasError = true;
        } else {
            setNameError('');
        }

        // Validate Age
        if (!age.trim()) {
            setAgeError('Age is required');
            hasError = true;
        } else if (isNaN(Number(age)) || Number(age) <= 0) {
            setAgeError('Please enter a valid age');
            hasError = true;
        } else {
            setAgeError('');
        }

        // Validate Gender
        if (!gender) {
            setGenderError('Gender is required');
            hasError = true;
        } else {
            setGenderError('');
        }

        // Optional: Validate Camera permission
        if (!cameraAccess) {
            hasError = true;
            CustomToast({ text: 'Camera permission is required', toastType: 'error' });
        }

        return !hasError;
    };

    // Function to handle sign in button press
    const handleSignIn = async () => {
        if (validateFields()) {
            // navigation.navigate('NavigationBarScreens');
            const formData = {
                "accepted_privacy_policy": false,
                "accepted_terms_and_conditions": false,
                "camera_enabled": false,
                "device_platform": "android",
                "device_token": "device_token",
                "dob": "",
                "email": "",
                "evening_checkin": "",
                "gender": "",
                "morning_checkin": "",
                "name": "",
                "notifications_enabled": "",
                "storage_enabled": ""
            };
            loginMutation.mutate(formData);
        }
    };

    const loginMutation = useMutation({
        mutationFn: async (formData: any) => {
            const { data } = await LOGIN_POST(formData);
            return data;
        },
        onSuccess: (data) => {
            // AsyncStorage.setItem('auth_token', data.data.token);
            // dispatch(loginSuccess(data.data.token));
            CustomToast({ text: data.message, toastType: 'success' });
            setTimeout(() => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'BottomNavigationBar' }],
                    })
                );
            }, 500);
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message, toastType: 'error' });
        },
    });


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

                    <TextInputBox
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                        error={nameError}
                    />
                    <SizeBox height={16} />
                    <TextInputBox
                        placeholder="Age"
                        keyboardType="number-pad"
                        value={age}
                        onChangeText={setAge}
                        error={ageError}
                    />
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