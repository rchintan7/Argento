import React from "react";
import { Animated, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Colors from "../../../constants/colors";

const RING_SIZE = 200;
const STROKE_WIDTH = 1.6;
const TRACK_OPACITY = 0.2;

const radiusForIndex = (i: number) => (RING_SIZE - STROKE_WIDTH) / 2 - i * 10;
const circumference = (r: number) => 2 * Math.PI * r;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
    firstRingColor: string;
    firstRingOffset: Animated.Value;
    totalRings?: number;
}

const FirstQuestionRing: React.FC<Props> = ({
    firstRingColor,
    firstRingOffset,
    totalRings = 5,
}) => {
    const outerRadius = radiusForIndex(totalRings - 1);
    const circ = circumference(outerRadius);

    return (
        <View
            style={{
                width: RING_SIZE,
                height: RING_SIZE,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
                {/* Base tracks */}
                {Array.from({ length: totalRings }).map((_, i) => (
                    <Circle
                        key={`track-${i}`}
                        cx={RING_SIZE / 2}
                        cy={RING_SIZE / 2}
                        r={radiusForIndex(i)}
                        stroke={Colors.ringColor}
                        strokeOpacity={TRACK_OPACITY}
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                    />
                ))}

                {/* Outermost ring dynamic */}
                <AnimatedCircle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={outerRadius}
                    stroke={firstRingColor}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeDasharray={`${circ} ${circ}`}
                    strokeDashoffset={firstRingOffset}
                    strokeLinecap="round"
                    rotation="-90"
                    originX={RING_SIZE / 2}
                    originY={RING_SIZE / 2}
                />
            </Svg>
        </View>
    );
};

export default FirstQuestionRing;