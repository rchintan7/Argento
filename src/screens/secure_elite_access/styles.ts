import { StyleSheet } from "react-native";
import Fonts from "../../constants/fonts";
import Colors from "../../constants/colors";

const SecureEliteAccessStyles = StyleSheet.create({
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

    planContainer: {
        backgroundColor: Colors.darkGrey,
        marginBottom: 10,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 10,
        padding: 16,
    },

    planTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.whiteColor,
    },
    planPrice: {
        fontSize: 30,
        fontWeight: '900',
        color: Colors.whiteColor,
    },
    planButtonContainer: {
        backgroundColor: Colors.buttonGrey,
        borderRadius: 6,
        paddingVertical: 8,
        alignItems: 'center',
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    valueView: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: Colors.primaryColor,
        borderRadius: 6,
    },
    valueText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.blackColor,
    }
});

export default SecureEliteAccessStyles;