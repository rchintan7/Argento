import React, { useEffect, useState, useMemo } from "react";
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
import {
    check,
    request,
    PERMISSIONS,
    RESULTS,
    requestNotifications,
    openSettings,
} from "react-native-permissions";

interface ActivateExperienceProps {
    route: { params: { email: string } };
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

// Helpers to convert between HH:mm and Date for the picker
const hhmmToDate = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d;
};

const dateToHHmm = (d: Date) => {
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
};

const ActivateExperience: React.FC<ActivateExperienceProps> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();

    // User info
    const [name, setName] = useState("");
    const [dob, setDob] = useState(""); // "YYYY-MM-DD"
    const [gender, setGender] = useState<string | null>("male");

    // Errors
    const [nameError, setNameError] = useState("");
    const [dobError, setDobError] = useState("");

    // Times
    const [morningTime, setMorningTime] = useState("07:00");
    const [eveningTime, setEveningTime] = useState("17:00");

    // Permissions
    const [cameraAccess, setCameraAccess] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [storage, setStorage] = useState(false);

    // Single shared Date/Time picker modal
    const [pickerVisible, setPickerVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState<"date" | "time">("time");
    const [pickerTag, setPickerTag] = useState<"morning" | "evening" | "dob" | null>(null);
    const [openingLocked, setOpeningLocked] = useState(false); // debounce rapid reopens

    useEffect(() => {
        // Pre-check camera on mount
        const perm = Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
        check(perm).then((result) => {
            if (result === RESULTS.GRANTED) setCameraAccess(true);
        });
    }, []);

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

    // CAMERA
    const handleCameraPermission = async () => {
        const permission = Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
        const status = await check(permission);

        if (status === RESULTS.GRANTED) {
            setCameraAccess(true);
            CustomToast({ text: "Camera already granted", toastType: "success" });
            return;
        }

        if (status === RESULTS.DENIED) {
            const newStatus = await request(permission);
            if (newStatus === RESULTS.GRANTED) {
                setCameraAccess(true);
                CustomToast({ text: "Camera permission granted", toastType: "success" });
            } else if (newStatus === RESULTS.BLOCKED) {
                setCameraAccess(false);
                showSettingsAlert("Camera");
            } else {
                setCameraAccess(false);
            }
            return;
        }

        if (status === RESULTS.BLOCKED) {
            setCameraAccess(false);
            showSettingsAlert("Camera");
        }
    };

    // NOTIFICATIONS
    const handleNotificationPermission = async () => {
        const { status } = await requestNotifications(["alert", "sound", "badge"]);
        if (status === RESULTS.GRANTED) {
            setNotifications(true);
            CustomToast({ text: "Notifications enabled", toastType: "success" });
        } else if (status === RESULTS.BLOCKED) {
            setNotifications(false);
            showSettingsAlert("Notifications");
        } else {
            setNotifications(false);
        }
    };

    // STORAGE
    const handleStoragePermission = async () => {
        const permission =
            Platform.OS === "ios" ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

        const status = await check(permission);

        if (status === RESULTS.GRANTED) {
            setStorage(true);
            CustomToast({ text: "Storage already granted", toastType: "success" });
            return;
        }

        if (status === RESULTS.DENIED) {
            const newStatus = await request(permission);
            if (newStatus === RESULTS.GRANTED) {
                setStorage(true);
                CustomToast({ text: "Storage access granted", toastType: "success" });
            } else if (newStatus === RESULTS.BLOCKED) {
                setStorage(false);
                showSettingsAlert("Storage");
            } else {
                setStorage(false);
            }
            return;
        }

        if (status === RESULTS.BLOCKED) {
            setStorage(false);
            showSettingsAlert("Storage");
        }
    };

    // Debounced openers to avoid double-mount race
    const openTime = (tag: "morning" | "evening") => {
        if (openingLocked || pickerVisible) return;
        setOpeningLocked(true);
        setTimeout(() => setOpeningLocked(false), 250);
        setPickerTag(tag);
        setPickerMode("time");
        setPickerVisible(true);
    };

    const openDate = () => {
        if (openingLocked || pickerVisible) return;
        setOpeningLocked(true);
        setTimeout(() => setOpeningLocked(false), 250);
        setPickerTag("dob");
        setPickerMode("date");
        setPickerVisible(true);
    };

    // Seed the picker with the active field value
    const seededDate = useMemo(() => {
        if (!pickerVisible) return new Date();
        if (pickerMode === "time") {
            const base = pickerTag === "morning" ? morningTime : eveningTime;
            return hhmmToDate(base || "07:00");
        }
        // Date mode
        return dob ? new Date(dob) : new Date();
    }, [pickerVisible, pickerMode, pickerTag, morningTime, eveningTime, dob]);

    const onPickerConfirm = (date: Date) => {
        // 1) Hide first so native commit is finalized (prevents dropped selection)
        setPickerVisible(false);

        // 2) Then update state based on tag
        if (pickerTag === "morning") {
            setMorningTime(dateToHHmm(date)); // e.g., 09:00 = 9 AM in 24h mode
        } else if (pickerTag === "evening") {
            setEveningTime(dateToHHmm(date));
        } else if (pickerTag === "dob") {
            setDob(date.toISOString().split("T")[0]);
        }

        setPickerTag(null);

        // 3) Defer any toasts to avoid overlapping with modal teardown on Android
        setTimeout(() => { }, 0);
    };

    const onPickerCancel = () => {
        setPickerVisible(false);
        setPickerTag(null);
    };

    const validateFields = () => {
        let hasError = false;

        if (!name.trim()) {
            setNameError("Name is required");
            hasError = true;
        } else {
            setNameError("");
        }

        if (!dob) {
            setDobError("Date of Birth is required");
            hasError = true;
        } else {
            setDobError("");
        }

        if (!cameraAccess) {
            hasError = true;
            CustomToast({ text: "Camera permission is required", toastType: "error" });
        }

        if (!notifications) {
            hasError = true;
            CustomToast({ text: "Notification permission is required", toastType: "error" });
        }

        if (!storage) {
            hasError = true;
            CustomToast({ text: "Storage permission is required", toastType: "error" });
        }

        return !hasError;
    };

    const loginMutation = useMutation({
        mutationFn: async (formData: any) => {
            const { data } = await LOGIN_POST(formData);
            return data;
        },
        onSuccess: () => {
            CustomToast({ text: "User created successful.", toastType: "success" });
            setTimeout(() => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "SecureEliteAccess" }],
                    })
                );
            }, 500);
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message, toastType: "error" });
        },
    });

    const handleSignIn = async () => {
        if (!validateFields()) return;
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
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
                        placeholder="Date of Birth"
                        value={dob}
                        editable={false}
                        readOnly
                        onPressIn={openDate}
                        error={dobError}
                    />

                    <SizeBox height={16} />

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

                    <TextInputBox
                        value={morningTime}
                        placeholder="Morning Check-in"
                        editable={false}
                        readOnly
                        onPressIn={() => openTime("morning")}
                    />
                    <SizeBox height={16} />

                    <TextInputBox
                        value={eveningTime}
                        placeholder="Evening Check-in"
                        editable={false}
                        readOnly
                        onPressIn={() => openTime("evening")}
                    />

                    <SizeBox height={24} />
                    <Text style={ActivateStyles.labelText}>Permissions</Text>
                    <SizeBox height={24} />

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

            {/* Single shared Date/Time picker with seeded date */}
            <DateTimePickerModal
                isVisible={pickerVisible}
                mode={pickerMode}
                date={seededDate} // seed with field's current value to prevent revert/overwrite
                display={
                    Platform.OS === "android"
                        ? (pickerMode === "time" ? "clock" : "calendar")
                        : "default"
                }
                is24Hour
                maximumDate={pickerTag === "dob" ? new Date() : undefined}
                onConfirm={onPickerConfirm}
                onCancel={onPickerCancel}
            />
        </View>
    );
};

export default ActivateExperience;