import React from 'react';
import { StyleSheet, Text, ActivityIndicator, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

interface AppButtonProps {
    text?: string;
    onPress?: () => void;
    loading?: boolean | undefined;
}

const AppButton: React.FC<AppButtonProps> = ({ text, onPress, loading }) => {
    return (
        <View style={styles.nextButton}>
            {
                loading
                    ? <View style={styles.touchable}>
                        <ActivityIndicator size="small" color={Colors.whiteColor} />
                    </View>
                    : <TouchableOpacity disabled={loading} onPress={loading ? undefined : onPress} style={styles.touchable}>
                        <Text style={[styles.nextButtonText, { maxWidth: 300 }]} numberOfLines={1}>{text}</Text>
                    </TouchableOpacity>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    nextButton: {
        borderRadius: 8,
        height: 48,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
    },
    touchable: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: {
        color: Colors.blackColor,
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});

export default AppButton;

