import { StyleSheet } from "react-native";
import Colors from "./colors";
import Fonts from "./fonts";

const GlobalStyles = StyleSheet.create({
    // Margin
    marginBottom10: {
        marginBottom: 10,
    },

    // Padding
    padding10: {
        padding: 10,
    },
    padding12: {
        padding: 12,
    },
    padding14: {
        padding: 14,
    },
    padding16: {
        padding: 16,
    },
    padding18: {
        padding: 18,
    },
    padding20: {
        padding: 20,
    },
    paddingHorizontal10: {
        paddingHorizontal: 10,
    },
    paddingHorizontal12: {
        paddingHorizontal: 12,
    },
    paddingHorizontal14: {
        paddingHorizontal: 14,
    },
    paddingHorizontal16: {
        paddingHorizontal: 16,
    },
    paddingHorizontal18: {
        paddingHorizontal: 18,
    },
    paddingHorizontal20: {
        paddingHorizontal: 20,
    },
    paddingVertical10: {
        paddingVertical: 10,
    },
    paddingVertical12: {
        paddingVertical: 12,
    },
    paddingVertical14: {
        paddingVertical: 14,
    },
    paddingVertical16: {
        paddingVertical: 16,
    },

    // Row Direction
    rowDirection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowDirectionCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowDirectionStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    rowDirectionVStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    // Centering
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    centerVertical: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    startVertical: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    aroundVertical: {
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    // Main Container
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.secondryColor,
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.secondryColor,
    },

    // Auth Container
    authContainer: {
        backgroundColor: Colors.secondryColor,
        borderRadius: 30,
        width: '94%',
    },

    // Auth Header Text
    authHeaderText: {
        fontSize: 24,
        fontFamily: Fonts.SemiBold,
        color: Colors.blackColor,
        textAlign: 'center',
    },

    // Auth Sub Header Image
    authSubHeaderImage: {
        width: '60%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default GlobalStyles;