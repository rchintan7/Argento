import React from "react";
import { Animated, Text, Dimensions } from "react-native";
import { Svgs } from "../../../constants/images";
import HomeStyles from "../styles";

const { width } = Dimensions.get("window");

interface Props {
    fadeAnim: Animated.Value;
    text: string;
}

const QuestionText: React.FC<Props> = ({ fadeAnim, text }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={[HomeStyles.questionText, { width: width * 0.85 }]}>
            <Svgs.rightArrow height={10} width={10} /> {text}
        </Text>
    </Animated.View>
);

export default QuestionText;