import { Dimensions, StyleSheet } from "react-native";
import Colors from "../../constants/colors";
import Fonts from "../../constants/fonts";
import GlobalStyles from "../../constants/global_styles";

const { width } = Dimensions.get('screen');

const HomeStyles = StyleSheet.create({
    headerView: {
        ...GlobalStyles.paddingHorizontal16,
        backgroundColor: Colors.bottomTabColor,
        alignItems: 'center',
        width: '100%',
    },
    weekContainer: {
        width: '100%',
        flexDirection: "row",
        backgroundColor: Colors.buttonGrey,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 8,
        justifyContent: "space-around",
        alignItems: 'center',
    },
    dayItem: {
        width: 32,
        height: 32,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    selectedDayItem: {
        backgroundColor: Colors.primaryColor,
    },
    dayText: {
        color: Colors.whiteColor,
        fontSize: 16,
        fontFamily: Fonts.Bold,
    },
    selectedDayText: {
        color: Colors.blackColor,
        fontSize: 16,
        fontFamily: Fonts.Bold,
    },
    calendarContainer: {
        overflow: "hidden",
        width: "100%",
        borderRadius: 10,
    },
    arrow: {
        borderRadius: 100,
        padding: 10,
    },
    calendar: {
        marginTop: 10,
        borderRadius: 12,
        backgroundColor: Colors.buttonGrey,
        paddingBottom: 5,
    },

    secondContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 30,
        paddingTop: 30
    },
    questionText: {
        color: Colors.primaryColor,
        fontSize: 16,
        fontFamily: Fonts.AnonymousRegular,
        lineHeight: 30,
    },
    ringImage: {
        height: 200,
        width: 200,
        alignSelf: 'center',
    },
    nextButton: {
        padding: 10,
        alignItems: 'center',
        alignSelf: 'flex-end',
        borderRadius: 10,
        backgroundColor: "rgba(0,0,0,0.01)",
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    nextText: {
        color: Colors.blackColor,
        fontSize: 20,
        fontWeight: "bold",
    },
    stepMarker: {
        height: 5,
        width: 5,
        borderRadius: 12,
        backgroundColor: Colors.sliderColor,
        bottom: -18,
        left: 15
    },
    successRingImage: {
        height: 330,
        width: 330,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 90,
    },

    chipContainer: {
        backgroundColor: Colors.bottomTabColor,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        height: 32,
        paddingHorizontal: 12,
    },
    selectedChipContainer: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        height: 32,
        paddingHorizontal: 12,
    },
    chipWraper: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        columnGap: 10,
        rowGap: 10,
    },
    chipText: {
        color: Colors.whiteColor,
        fontSize: 14,
        fontWeight: "400",
    },
    selectedChipText: {
        color: Colors.blackColor,
        fontSize: 14,
        fontWeight: "400",
    },

    modelBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    modelContainer: {
        backgroundColor: Colors.bottomTabColor,
        borderRadius: 16,
        padding: 16,
    },
    modelTitle: {
        color: Colors.whiteColor,
        fontSize: 16,
        fontWeight: "600",
        alignSelf: 'center',
    },

    checkInButton: {
        borderRadius: 8,
        height: 48,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        marginBottom: 20,
    },
    checkInDissableButton: {
        borderRadius: 8,
        height: 48,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bottomTabColor,
        marginBottom: 20,
    },
    checkInButtonText: {
        color: Colors.blackColor,
        fontSize: 16,
        fontFamily: Fonts.Medium,
        letterSpacing: 0.8,
    },
    checkInDisablenText: {
        color: Colors.primaryColor,
        fontSize: 16,
        fontFamily: Fonts.Medium,
        letterSpacing: 0.8,
    },
    boxBorder: {
        borderRadius: 10,
        borderWidth: 1.5,
        justifyContent: 'flex-start',
        padding: 12,
        height: 180,
        borderColor: Colors.primaryColor,
        backgroundColor: Colors.darkGrey,
        width: width / 1.2,
        marginTop: 40,
    },
    boxUnderStyle: {
        color: Colors.whiteColor,
        padding: 0,
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        fontWeight: '600',
        fontSize: 16,
        height: '100%',
        width: '100%'
    },
    errorRowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    errorText: {
        fontSize: 12,
        lineHeight: 13,
        color: Colors.redColor,
        fontWeight: '500',
    },
});

export default HomeStyles;