import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

interface AnimatedRingProps {
    progress: number;
}

const AnimatedRing: React.FC<AnimatedRingProps> = ({ progress }) => {
    const animated = useRef(new Animated.Value(progress)).current;

    useEffect(() => {
        Animated.timing(animated, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const rotate = animated.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    const scale = animated.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1.1],
    });

    return (
        <View style={styles.outerCircle}>
            <Animated.View
                style={[
                    styles.innerCircle,
                    {
                        transform: [{ rotate }, { scale }],
                        borderColor: "#00FF66",
                    },
                ]}
            />
        </View>
    );
};

export default AnimatedRing;

const styles = StyleSheet.create({
    outerCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#222",
        alignSelf: 'center',
    },
    innerCircle: {
        position: "absolute",
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 3,
    },
});
