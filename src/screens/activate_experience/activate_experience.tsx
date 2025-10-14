import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    Text,
    View,
    Platform,
    Alert,
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
import { CustomToast } from "../../utils/toast";
import { CommonActions } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { check, request, PERMISSIONS, RESULTS, requestNotifications, openSettings } from "react-native-permissions";

interface ActivateExperienceProps {
    route: {
        params: {
            email: string;
        };
    };
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

const ActivateExperience: React.FC<ActivateExperienceProps> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();

    useEffect(() => {
        check(PERMISSIONS.ANDROID.CAMERA).then(result => {
            if (result === RESULTS.GRANTED) setCameraAccess(true);
        });
    }, []);

    // 🔹 Reusable Alert to open settings
    const showSettingsAlert = (title: string) => {
        Alert.alert(
            `${title} Permission`,
            `You have permanently denied ${title.toLowerCase()} access. Please enable it from app settings.`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Open Settings", onPress: () => openSettings() },
            ],
            { cancelable: true }
        );
    };

    // 🔹 CAMERA Permission
    const handleCameraPermission = async () => {
        const permission =
            Platform.OS === "ios"
                ? PERMISSIONS.IOS.CAMERA
                : PERMISSIONS.ANDROID.CAMERA;

        const status = await check(permission);

        if (status === RESULTS.GRANTED) {
            setCameraAccess(true);
            CustomToast({ text: "Camera already granted", toastType: "success" });
        } else if (status === RESULTS.DENIED) {
            const newStatus = await request(permission);
            if (newStatus === RESULTS.GRANTED) {
                setCameraAccess(true);
                CustomToast({ text: "Camera permission granted", toastType: "success" });
            } else if (newStatus === RESULTS.BLOCKED) {
                showSettingsAlert("Camera");
                setCameraAccess(false);
            } else {
                setCameraAccess(false);
            }
        } else if (status === RESULTS.BLOCKED) {
            showSettingsAlert("Camera");
            setCameraAccess(false);
        }
    };

    // 🔹 NOTIFICATIONS Permission
    const handleNotificationPermission = async () => {
        const { status } = await requestNotifications(["alert", "sound", "badge"]);

        if (status === RESULTS.GRANTED) {
            setNotifications(true);
            CustomToast({ text: "Notifications enabled", toastType: "success" });
        } else if (status === RESULTS.BLOCKED) {
            showSettingsAlert("Notifications");
            setNotifications(false);
        } else {
            setNotifications(false);
        }
    };

    // 🔹 STORAGE Permission
    const handleStoragePermission = async () => {
        const permission =
            Platform.OS === "ios"
                ? PERMISSIONS.IOS.PHOTO_LIBRARY
                : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

        const status = await check(permission);

        if (status === RESULTS.GRANTED) {
            setStorage(true);
            CustomToast({ text: "Storage already granted", toastType: "success" });
        } else if (status === RESULTS.DENIED) {
            const newStatus = await request(permission);
            if (newStatus === RESULTS.GRANTED) {
                setStorage(true);
                CustomToast({ text: "Storage access granted", toastType: "success" });
            } else if (newStatus === RESULTS.BLOCKED) {
                showSettingsAlert("Storage");
                setStorage(false);
            } else {
                setStorage(false);
            }
        } else if (status === RESULTS.BLOCKED) {
            showSettingsAlert("Storage");
            setStorage(false);
        }
    };

    // 🔹 User info
    const [name, setName] = useState('');
    const [dob, setDob] = useState(''); // string format: "YYYY-MM-DD"
    const [showDobPicker, setShowDobPicker] = useState(false);
    const [dobError, setDobError] = useState('');
    const [gender, setGender] = useState<string | null>('male');

    // State for errors
    const [nameError, setNameError] = useState('');
    const [ageError, setAgeError] = useState('');

    // 🔹 Time pickers
    const [morningTime, setMorningTime] = useState("9:00");
    const [eveningTime, setEveningTime] = useState("7:00");
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedField, setSelectedField] = useState<"morning" | "evening" | null>(null);

    // 🔹 Permissions
    const [cameraAccess, setCameraAccess] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [storage, setStorage] = useState(false);

    // 🔹 Time Picker Handler
    const handleConfirm = (date: Date) => {
        // Force 24-hour format
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

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

        // Validate DOB
        if (!dob) {
            setDobError('Date of Birth is required');
            hasError = true;
        } else {
            setDobError('');
        }

        // Optional: Validate Camera permission
        if (!cameraAccess) {
            hasError = true;
            CustomToast({ text: 'Camera permission is required', toastType: 'error' });
        }

        // Optional: Validate Notification permission
        if (!notifications) {
            hasError = true;
            CustomToast({ text: 'Notification permission is required', toastType: 'error' });
        }

        // Optional: Validate Storage permission
        if (!storage) {
            hasError = true;
            CustomToast({ text: 'Storage permission is required', toastType: 'error' });
        }

        return !hasError;
    };

    // Function to handle sign in button press
    const handleSignIn = async () => {
        if (validateFields()) {
            const formData = {
                accepted_privacy_policy: true,
                accepted_terms_and_conditions: true,
                camera_enabled: cameraAccess,
                device_platform: Platform.OS,
                device_token: "device_token_123",
                dob: dob,
                email: route?.params?.email,
                evening_checkin: eveningTime,
                gender: gender,
                morning_checkin: morningTime,
                name: name.trim(),
                notifications_enabled: notifications,
                storage_enabled: storage,
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
            CustomToast({ text: 'User created successful.', toastType: 'success' });
            setTimeout(() => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'SecureEliteAccess' }],
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
                        value={dob}
                        editable={false}
                        readOnly
                        onChangeText={setDob}
                        error={dobError}
                        onPressIn={() => setShowDobPicker(true)}
                    />
                    <SizeBox height={16} />

                    {/* 🔹 Gender Dropdown */}
                    <Dropdown
                        style={ActivateStyles.dropdown}
                        placeholderStyle={{ color: Colors.placHolder }}
                        selectedTextStyle={{ color: Colors.whiteColor }}
                        data={genderOptions}
                        maxHeight={350}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Gender"
                        value={gender}
                        containerStyle={ActivateStyles.containerStyle}
                        itemContainerStyle={ActivateStyles.itemContainerStyle}
                        activeColor={Colors.placHolder + 30}
                        itemTextStyle={{ color: Colors.whiteColor }}
                        onChange={(item) => setGender(item.value)}
                    />

                    <SizeBox height={24} />
                    <Text style={ActivateStyles.labelText}>Check-in Preferences</Text>
                    <SizeBox height={24} />

                    {/* 🔹 Morning Check-in */}
                    <TextInputBox
                        value={morningTime}
                        placeholder="Morning Check-in"
                        editable={false}
                        readOnly
                        onPressIn={() => {
                            setSelectedField("morning");
                            setShowTimePicker(true);
                        }}
                    />
                    <SizeBox height={16} />

                    {/* 🔹 Evening Check-in */}
                    <TextInputBox
                        value={eveningTime}
                        placeholder="Evening Check-in"
                        editable={false}
                        readOnly
                        onPressIn={() => {
                            setSelectedField("evening");
                            setShowTimePicker(true);
                        }}
                    />

                    {/* 🔹 Time Picker Modal */}
                    <DateTimePickerModal
                        isVisible={showTimePicker}
                        mode="time"
                        onConfirm={handleConfirm}
                        onCancel={() => setShowTimePicker(false)}
                        is24Hour={true}
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
                            offColor={Colors.borderColor + 60}
                            size="medium"
                            onToggle={(isOn) => {
                                if (isOn) handleCameraPermission();
                                else setCameraAccess(false);
                            }}
                        />
                    </View>
                    <View style={ActivateStyles.switchRow}>
                        <Text style={ActivateStyles.swichLabelText}>Notifications</Text>
                        <ToggleSwitch
                            isOn={notifications}
                            onColor="green"
                            offColor={Colors.borderColor + 60}
                            size="medium"
                            onToggle={(isOn) => {
                                if (isOn) handleNotificationPermission();
                                else setNotifications(false);
                            }}
                        />
                    </View>
                    <View style={ActivateStyles.switchRow}>
                        <Text style={ActivateStyles.swichLabelText}>Storage</Text>
                        <ToggleSwitch
                            isOn={storage}
                            onColor="green"
                            offColor={Colors.borderColor + 60}
                            size="medium"
                            onToggle={(isOn) => {
                                if (isOn) handleStoragePermission();
                                else setStorage(false);
                            }}
                        />
                    </View>

                    <SizeBox height={40} />

                    <AppButton
                        text={"Continue"}
                        onPress={handleSignIn}
                        loading={loginMutation.isPending}
                    />
                    <SizeBox height={40} />
                </ScrollView>
            </KeyboardAvoidingView>
            <Toast />
            <DateTimePickerModal
                isVisible={showDobPicker}
                mode="date"
                maximumDate={new Date()} // DOB cannot be in future
                onConfirm={(date: Date) => {
                    const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
                    setDob(formattedDate);
                    setShowDobPicker(false);
                }}
                onCancel={() => setShowDobPicker(false)}
            />
        </View>
    );
};

export default ActivateExperience;