import React from "react";
import { TouchableOpacity } from "react-native";
import { Svgs } from "../../../constants/images";
import HomeStyles from "../styles";

interface Props {
    onPress: () => void;
    visible: boolean;
}

const NextButton: React.FC<Props> = ({ onPress, visible }) => {
    if (!visible) return null;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[HomeStyles.nextButton, { transform: [{ rotate: "270deg" }] }]}
            activeOpacity={0.7}
        >
            <Svgs.downArrow height={24} width={24} />
        </TouchableOpacity>
    );
};

export default NextButton;