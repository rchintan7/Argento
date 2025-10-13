import { StyleSheet } from "react-native";
import Fonts from "../../constants/fonts";
import Colors from "../../constants/colors";

const ActivateStyles = StyleSheet.create({
    headerView: {
        backgroundColor: Colors.primaryColor,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 26,
        fontFamily: Fonts.Bold,
        color: Colors.blackColor,
        marginVertical: 10,
        alignSelf: 'center',
    },
    text: {
        fontSize: 28,
        fontFamily: Fonts.Bold,
        color: Colors.whiteColor,
        lineHeight: 40,
        alignSelf: 'center',
    },

    subtitle: {
        fontSize: 16,
        color: Colors.whiteColor,
        textAlign: "center",
    },
    nextButtonView: {
        paddingHorizontal: 20,
        width: '100%'
    },
    labelText: {
        fontSize: 18,
        color: Colors.whiteColor,
        fontWeight: '700',
    },
    swichLabelText: {
        fontSize: 16,
        color: Colors.whiteColor,
        fontWeight: '500',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    dropdown: {
        height: 56,
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: Colors.darkGrey,
    },
    containerStyle: {
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: Colors.darkGrey,
        borderWidth: 1,
        borderColor: Colors.placHolder,
    },
    itemContainerStyle: {
        backgroundColor: Colors.darkGrey,
        borderRadius: 4,
    },
});

export default ActivateStyles;