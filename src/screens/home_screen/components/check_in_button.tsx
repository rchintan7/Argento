import React from "react";
import { Text, TouchableOpacity } from "react-native";
import HomeStyles from "../styles";

interface CheckInButtonProps {
    onPress: () => void;
    visible: boolean;
    title: string;
    disabled: boolean;
}

const CheckInButton: React.FC<CheckInButtonProps> = ({ onPress, title, visible, disabled }) => {
    if (!visible) return null;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={disabled ? HomeStyles.checkInDissableButton : HomeStyles.checkInButton}
        >
            <Text style={disabled ? HomeStyles.checkInDisablenText : HomeStyles.checkInButtonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default CheckInButton;

export const parseToday = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
};

export const toAmPm = (hhmm: string) => {
    const [h24, m] = hhmm.split(":").map(Number);
    const ampm = h24 >= 12 ? "pm" : "am";
    const h12 = ((h24 + 11) % 12) + 1;
    const mm = m.toString().padStart(2, "0");
    return `${h12}:${mm} ${ampm}`;
};

// useCheckinGates.ts
import { useEffect, useMemo, useState } from "react";

type Gates = {
    showMorning: boolean;
    morningEnabled: boolean;
    eveningEnabled: boolean;
};

export const useCheckinGates = (morningHHMM: string, eveningHHMM: string) => {
    const [now, setNow] = useState<Date>(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 30_000); // tick every 30s
        return () => clearInterval(t);
    }, []);

    return useMemo<Gates>(() => {
        const morningAt = parseToday(morningHHMM);
        const noon = new Date();
        noon.setHours(16, 0, 0, 0);

        const eveningAt = parseToday(eveningHHMM);

        const isBeforeNoon = now < noon;

        const morningEnabled = now >= morningAt && now < noon;
        const eveningEnabled = now >= eveningAt;

        // Decide which button to show on Home index === 0
        // If before noon, prefer morning; else evening
        const showMorning = isBeforeNoon;

        return { showMorning, morningEnabled, eveningEnabled };
    }, [morningHHMM, eveningHHMM, now]);
};
