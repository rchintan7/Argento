import React from 'react';
import { StyleSheet, View, Modal, ActivityIndicator, Platform } from 'react-native';
import Colors from '../constants/colors';

const Loader = (props: any) => {
    const { loading } = props;
    return (
        <Modal
            transparent={true}
            animationType={'fade'}
            visible={loading}
            navigationBarTranslucent={Platform.OS === 'android'}
            statusBarTranslucent={Platform.OS === 'android'}
            onRequestClose={() => {
                console.log('close modal');
            }}>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator
                        animating={true}
                        color={Colors.whiteColor}
                        size="large"
                    />
                </View>
            </View>
        </Modal>
    );
};
export default Loader;


const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#00000040',
        justifyContent: 'center',
    },
    activityIndicatorWrapper: {
        alignItems: 'center',
        backgroundColor: Colors.bottomTabColor,
        justifyContent: 'center',
        padding: 20,
        borderRadius: 10,
        shadowColor: Colors.blackColor + 20,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 0
    },
});
