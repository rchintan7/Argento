import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { ACTIVITIES_GET, ACTIVITIES_CREATE_POST } from "../../../services/api_endpoint";
import { CustomToast } from "../../../utils/toast";
import HomeStyles from "../styles";
import SizeBox from "../../../constants/sizebox";
import TextInputBox from "../../../componets/text_input_box";
import { Svgs } from "../../../constants/images";
import GlobalStyles from "../../../constants/global_styles";
import AppButton from "../../../componets/app_button";

type Activity = {
    id: string;
    activity_group_id: string;
    name: string;
    is_custom: boolean;
    display_order: number;
};

type ActivityGroup = {
    id: string;
    name: string;
    icon?: string;
    display_order: number;
    activities?: Activity[];
};

interface ActivitiesChipProps {
    onSelect?: (activity: Activity) => void;
    selectedIds?: string[];
}

const ActivitiesChip: React.FC<ActivitiesChipProps> = ({
    onSelect,
    selectedIds = [],
}) => {
    const [activityGroups, setActivityGroups] = useState<ActivityGroup[]>([]);
    const [selected, setSelected] = useState<string[]>(selectedIds);

    const [addVisible, setAddVisible] = useState(false);
    const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
    const [newName, setNewName] = useState("");
    const [nameError, setNameError] = useState("");

    const activitiesMutation = useMutation({
        mutationFn: async () => {
            const response = await ACTIVITIES_GET();
            return response?.data || response;
        },
        onSuccess: (data) => {
            if (Array.isArray(data)) {
                const sortedGroups = [...data].sort(
                    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
                );

                sortedGroups.forEach((group) => {
                    if (Array.isArray(group.activities)) {
                        group.activities.sort(
                            (a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0)
                        );
                    } else {
                        group.activities = [];
                    }
                });

                setActivityGroups(sortedGroups);
            } else {
                console.warn("Unexpected activities data:", data);
            }
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message ?? "Failed to load activities", toastType: "error" });
        },
    });

    useEffect(() => {
        activitiesMutation.mutate();
    }, []);

    // ✅ handle chip toggle
    const handleSelect = (activityId: string) => {
        let updated: any;
        if (selected.includes(activityId)) {
            updated = selected.filter((id) => id !== activityId);
        } else {
            updated = [...selected, activityId];
        }
        setSelected(updated);
        onSelect?.(updated);
    };

    const openAddModal = (groupId: string) => {
        setTargetGroupId(groupId);
        setNewName("");
        setAddVisible(true);
    };

    const validateFields = () => {
        let hasError = false;

        if (!newName.trim()) {
            setNameError("Activitie name is required");
            hasError = true;
        } else {
            setNameError("");
        }

        return !hasError;
    };

    const submitAdd = () => {
        if (!validateFields()) return;
        createMutation.mutate({ activity_group_id: targetGroupId, name: newName });
    };

    const createMutation = useMutation({
        mutationFn: async (formData: any) => {
            const { data } = await ACTIVITIES_CREATE_POST(formData);
            return data;
        },
        onSuccess: (data) => {
            activitiesMutation.mutate();
            setAddVisible(false);
            setNewName("");
            CustomToast({ text: "Activity added", toastType: "success" });
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message ?? "Failed to load activities", toastType: "error" });
        },
    });

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <SizeBox height={20} />
            <View style={{ rowGap: 25 }}>
                {
                    activityGroups.map((group) => {
                        // ensure activities array
                        const items: Activity[] = Array.isArray(group.activities) ? group.activities : [];

                        // 1) make a synthetic first chip for Add +
                        const addChip: Activity = {
                            id: `__add__:${group.id}`,
                            activity_group_id: group.id,
                            name: "Add +",
                            is_custom: true,
                            display_order: -1,
                        };

                        // 2) prepend it
                        const chips = [addChip, ...items];
                        return (
                            <View key={group.id} style={HomeStyles.chipWraper}>
                                {chips.map((item) => {
                                    const isAdd = item.id.startsWith("__add__");
                                    const isSelected = !isAdd && selected.includes(item.id);

                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={isAdd ? HomeStyles.chipContainer : (isSelected ? HomeStyles.selectedChipContainer : HomeStyles.chipContainer)}
                                            onPress={() => {
                                                if (isAdd) {
                                                    openAddModal(item.activity_group_id);
                                                    return;
                                                }
                                                handleSelect(item.id);
                                            }}
                                        >
                                            <Text style={isAdd ? HomeStyles.chipText : (isSelected ? HomeStyles.selectedChipText : HomeStyles.chipText)}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        );
                    })
                }
            </View>
            {/* Add modal */}
            <Modal
                visible={addVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setAddVisible(false)}
                statusBarTranslucent
                navigationBarTranslucent
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={HomeStyles.modelBackdrop}
                >
                    <View style={HomeStyles.modelContainer}>
                        <View style={GlobalStyles.rowDirection}>
                            <Text style={HomeStyles.modelTitle}>Add activity</Text>
                            <TouchableOpacity onPress={() => setAddVisible(false)}>
                                <Svgs.closeIcon height={24} width={24} />
                            </TouchableOpacity>
                        </View>
                        <SizeBox height={30} />
                        <TextInputBox
                            placeholder="Activities name"
                            value={newName}
                            onChangeText={setNewName}
                            error={nameError}
                            height={50}
                        />
                        <SizeBox height={30} />
                        <AppButton
                            text="Create"
                            loading={createMutation.isPending}
                            onPress={submitAdd}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </ScrollView>
    );
};

export default ActivitiesChip;