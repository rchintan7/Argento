import React from "react";
import { Animated, Image, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import HomeStyles from "../styles";
import { Images } from "../../../constants/images";
import Colors from "../../../constants/colors";

const RING_SIZE = 200;
const STROKE_WIDTH = 1.6;
const TRACK_OPACITY = 0.2;

const radiusForIndex = (i: number) => (RING_SIZE - STROKE_WIDTH) / 2 - i * 10;
const circumference = (r: number) => 2 * Math.PI * r;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
    ringColors: string[];
    ringOffsets: Animated.Value[];
    showSuccess: boolean;
    successScale: Animated.Value;
}

const QuestionRing: React.FC<Props> = ({
    ringColors,
    ringOffsets,
    showSuccess,
    successScale,
}) => {
    return (
        <View
            style={{
                width: RING_SIZE,
                height: RING_SIZE,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* {showSuccess && (
                <Animated.Image
                    source={Images.successRingImage}
                    style={[HomeStyles.successRingImage, { transform: [{ scale: successScale }] }]}
                    resizeMode="contain"
                />
            )} */}

            <Svg
                width={RING_SIZE}
                height={RING_SIZE}
                // opacity={showSuccess ? 0.4 : 1}
                viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            >
                {/* Base tracks */}
                {Array.from({ length: 5 }).map((_, i) => {
                    const r = radiusForIndex(i);
                    return (
                        <Circle
                            key={`track-${i}`}
                            cx={RING_SIZE / 2}
                            cy={RING_SIZE / 2}
                            r={r}
                            stroke={Colors.ringColor}
                            strokeOpacity={TRACK_OPACITY}
                            strokeWidth={STROKE_WIDTH}
                            fill="none"
                        />
                    );
                })}

                {/* Animated arcs */}
                {Array.from({ length: 5 }).map((_, i) => {
                    const r = radiusForIndex(i);
                    const circ = circumference(r);
                    const stroke = ringColors[i];
                    return (
                        <AnimatedCircle
                            key={`arc-${i}`}
                            cx={RING_SIZE / 2}
                            cy={RING_SIZE / 2}
                            r={r}
                            stroke={stroke}
                            strokeWidth={STROKE_WIDTH}
                            fill="none"
                            strokeDasharray={`${circ} ${circ}`}
                            strokeDashoffset={ringOffsets[i] as unknown as number}
                            strokeLinecap="round"
                            rotation="-90"
                            originX={RING_SIZE / 2}
                            originY={RING_SIZE / 2}
                        />
                    );
                })}
            </Svg>
        </View>
    );
};

export default QuestionRing;
