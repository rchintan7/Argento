import Snackbar from 'react-native-snackbar';
import Fonts from '../constants/fonts';
import SecToast, { ToastShowParams } from 'react-native-toast-message';
import Colors from '../constants/colors';

// Define the type for the ToastType parameter
export type ToastType = 'success' | 'error' | 'info' | string;

// Define the type for the options of Snackbar
interface SnackbarOptions {
    text: string;
    duration: number;
    backgroundColor: string;
    textColor: string;
}

// Function to show a custom Snackbar
export const CustomSnackbar = async (text: string): Promise<void> => {
    const options: SnackbarOptions = {
        text: text,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Colors.primaryColor,
        textColor: 'white',
    };
    Snackbar.show(options);
};

// Function to show a custom Toast
export const CustomToast = (value: {
    text?: string,
    subText?: string,
    toastType: ToastType
}) => {
    try {
        const options: ToastShowParams = {
            type: value.toastType,
            text1: value.text,
            text2: value.subText,
            position: 'bottom',
            text1Style: {
                fontWeight: '500',
                fontSize: 14,
            },
            text2Style: {
                fontWeight: '500',
                fontSize: 12,
            }
        };
        SecToast.show(options);
    } catch (e) {
        console.log(e);
    }
};
