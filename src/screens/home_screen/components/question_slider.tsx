import React from "react";
import { View, Dimensions } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import Colors from "../../../constants/colors";
import HomeStyles from "../styles";
import SizeBox from "../../../constants/sizebox";

const { width } = Dimensions.get("window");

interface Props {
    value: number;
    setValue: (v: number) => void;
    min: number;
    max: number;
    currentOptionColor: string;
}

const QuestionSlider: React.FC<Props> = ({ value, setValue, min, max, currentOptionColor }) => {
    const Marker = () => <View style={HomeStyles.stepMarker} />;

    return (
        <>
            <Slider
                value={value}
                onValueChange={(v) => setValue(Array.isArray(v) ? v[0] : v)}
                containerStyle={{ width: width * 0.85 }}
                maximumTrackTintColor={Colors.sliderColor}
                minimumTrackTintColor={currentOptionColor}
                minimumValue={min}
                maximumValue={max}
                step={1}
                trackMarks={[1, 2, 3, 4, 5]}
                thumbStyle={{ height: 19, width: 32, backgroundColor: currentOptionColor }}
                renderTrackMarkComponent={Marker}
                animationType="timing"
            />
            <SizeBox height={90} />
        </>
    );
};

export default QuestionSlider;
