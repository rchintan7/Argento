import { Dimensions, StyleSheet } from "react-native";
import Colors from "../../constants/colors";
import Fonts from "../../constants/fonts";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondryColor,
        paddingTop: 12,
        paddingHorizontal: 12,
        paddingBottom: 40
    },
    headerContainer: {
        width: width,
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 24,
        paddingVertical: 24
    },
    header: {
        color: Colors.primaryColor,
        fontSize: 28,
        fontFamily: Fonts.Bold
    },
    rangeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: Colors.buttonGrey,
        borderRadius: 16,
        marginVertical: 20,
        paddingVertical: 8,
        height: 48,
    },
    rangeButton: {
        borderRadius: 10,
        height: 24,
        width: 75.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rangeButtonActive: {
        borderRadius: 24,
        height: 24,
        paddingHorizontal: 10,
        width: 75.5,
        // paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
    },
    rangeText: {
        color: Colors.whiteColor,
        fontSize: 12,
        fontFamily: Fonts.AnonymousBold
    },
    rangeTextActive: {
        color: Colors.secondryColor,
        fontSize: 12,
        fontFamily: Fonts.AnonymousBold
    },
    summaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: Colors.bottomTabColor,
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    summaryItem: {
        width: '46%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 6,
        alignItems: 'center',
        paddingHorizontal: 10
    },
    summaryLabel: {
        color: Colors.whiteColor,
        fontSize: 16,
        fontFamily: Fonts.AnonymousBold,
        textAlign: 'center'
    },
    summaryValue: {
        color: Colors.primaryColor,
        fontSize: 32,
        fontFamily: Fonts.Bold,
        textAlign: 'center'
    },
    gridContainer: {
        flexDirection: 'row',
        marginBottom: 25,
        marginVertical: 16,
        width: '100%',
        paddingLeft: 6
    },
    metricLabel: {
        color: Colors.whiteColor,
        fontSize: 12,
        fontFamily: Fonts.AnonymousBold
    },
    dayColumn: {
        alignItems: 'center',
        marginHorizontal: 7,
    },
    colorBox: {
        width: 27,
        height: 39,
        marginVertical: 0.4,
        borderRadius: 2,
    },
    dayLabel: {
        color: Colors.whiteColor,
        fontSize: 16,
        marginTop: 4,
        fontFamily: Fonts.Bold
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    sectionTitle: {
        color: Colors.primaryColor,
        fontSize: 12,
        fontFamily: Fonts.AnonymousBold
    },
    insightList: {
        marginTop: 10,
    },
    insightCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
    },
    errorCard: {
        backgroundColor: '#1E1E1E',
        borderColor: '#FF4C4C',
        borderWidth: 1,
    },
    insightWeek: {
        color: Colors.primaryColor,
        fontFamily: Fonts.AnonymousBold,
        fontSize: 10
    },
    insightDate: {
        color: '#9C9C9C',
        fontFamily: Fonts.AnonymousBold,
        fontSize: 10
    },
    insightMessage: {
        color: Colors.whiteColor,
        fontSize: 12,
        fontFamily: Fonts.AnonymousBold,
        paddingTop: 10
    },
    errorText: {
        color: '#FF4C4C',
    },
    insightsText: {
        color: Colors.whiteColor,
        paddingVertical: 20
    }
});

export default styles;