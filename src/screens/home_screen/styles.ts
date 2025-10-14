import { StyleSheet } from "react-native";
import Colors from "../../constants/colors";
import Fonts from "../../constants/fonts";
import GlobalStyles from "../../constants/global_styles";

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
        paddingVertical: 30
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
});

export default HomeStyles;