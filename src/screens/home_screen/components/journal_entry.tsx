import React, { useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";
import HomeStyles from "../styles";
import Colors from "../../../constants/colors";

interface JournalEntryProps {
    onChange?: (text: string) => void;
    error?: boolean;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ onChange, error = false }) => {
    const inputRef = useRef<TextInput>(null);
    const [journalText, setJournalText] = useState("");
    const [showError, setShowError] = useState(error);

    useEffect(() => {
        setShowError(error);
    }, [error]);

    const handleChangeText = (text: string) => {
        setJournalText(text);
        onChange?.(text);
        if (showError && text.trim()) setShowError(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={HomeStyles.boxBorder}>
                <TextInput
                    ref={inputRef}
                    value={journalText}
                    keyboardType='default'
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    style={HomeStyles.boxUnderStyle}
                    multiline
                    onChangeText={handleChangeText}
                    placeholder="Jornal entry ..."
                    placeholderTextColor={Colors.placHolder}
                />
                {
                    showError && <View style={HomeStyles.errorRowStyle}>
                        <Text style={HomeStyles.errorText}>{'Please enter jornal entry.'}</Text>
                    </View>
                }
            </View>
        </KeyboardAvoidingView>
    );
};

export default JournalEntry;