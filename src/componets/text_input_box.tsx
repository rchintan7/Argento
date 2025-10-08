import React, { useRef, useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    TextInputProps,
    ImageSourcePropType,
    StyleProp,
    ViewStyle,
    ColorValue,
    Keyboard,
} from 'react-native';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import { Svgs } from '../constants/images';
import GlobalStyles from '../constants/global_styles';
import SizeBox from '../constants/sizebox';

interface TextInputBoxProps extends TextInputProps {
    label?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    image?: ImageSourcePropType | undefined;
    error?: string;
    readonly?: boolean | undefined;
    style?: StyleProp<ViewStyle> | undefined;
    keyboardType?: TextInputProps['keyboardType'];
    backgroundColor?: ColorValue | undefined;
    require?: boolean | undefined;
    disable?: boolean;
}

const TextInputBox: React.FC<TextInputBoxProps> = (props) => {
    const inputRef = useRef<TextInput>(null);
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={props.style ?? styles.mainBox}>
            {props.label && (
                <View style={GlobalStyles.rowDirectionStart}>
                    <View style={styles.labelContainer}>
                        <SizeBox width={6} />
                        <Text style={styles.labelStyle}>{props.label}</Text>
                    </View>
                    {props.require && <Text style={styles.labelIconStyle}>{`*`}</Text>}
                </View>
            )}
            {props.label && <SizeBox height={5} />}
            <View style={[styles.boxBorder, { backgroundColor: props.backgroundColor ?? Colors.darkGrey }]}>
                <TextInput
                    ref={inputRef}
                    {...props}
                    placeholder={props.placeholder}
                    secureTextEntry={!isPasswordVisible && props.secureTextEntry}
                    placeholderTextColor={Colors.placHolder}
                    editable={props.editable}
                    keyboardType={props.keyboardType}
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    style={[
                        styles.boxUnderStyle,
                        {
                            paddingRight: props.secureTextEntry ? 25 : 0,
                            color: props.value && props.value.length > 0 ? Colors.whiteColor : Colors.placHolder,
                            fontWeight: props.value && props.value.length > 0 ? '600' : '500',
                        },
                    ]}
                    value={props.value}
                    onChangeText={props.onChangeText}
                    readOnly={props.readOnly ?? false}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {props.secureTextEntry && (
                    <View style={styles.secureIconStyle}>
                        <TouchableOpacity onPress={togglePasswordVisibility} style={[GlobalStyles.paddingHorizontal14, GlobalStyles.paddingVertical10]}>
                            <View style={styles.eyesIcon}>
                                {/* <Svgs.openEye height={22} width={22} /> */}
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {props.error && (
                <View style={styles.errorRowStyle}>
                    {/* <Svgs.requireIcon height={14} width={14} /> */}
                    <Text style={styles.errorText}>{props.error}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    mainBox: {
        width: '100%',
    },
    boxBorder: {
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: 'center',
        paddingHorizontal: 12,
        height: 56,
        borderColor: Colors.darkGrey,
        backgroundColor: Colors.darkGrey,
    },
    labelContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
    },
    labelStyle: {
        color: Colors.whiteColor,
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 21,
    },
    labelIconStyle: {
        color: Colors.redColor,
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 20,
    },
    eyesIcon: {
        height: 20,
        width: 20,
        resizeMode: 'cover',
        tintColor: Colors.primaryColor,
    },
    boxUnderStyle: {
        color: Colors.whiteColor,
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: '600',
        fontSize: 16,
        height: '100%',
    },
    errorRowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
        marginTop: 6,
    },
    errorText: {
        fontSize: 11,
        lineHeight: 13,
        color: Colors.redColor,
        fontWeight: '500',
        marginLeft: 5,
    },
    secureIconStyle: {
        position: 'absolute',
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
});

export default TextInputBox;
