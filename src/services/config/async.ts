import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveValueInAsync = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
};

export const getValueFromAsync = async (key: string) => {
    return await AsyncStorage.getItem(key);
};

export const clearAllAsync = async () => {
    await AsyncStorage.clear();
};

export const saveAppleKeyInAsync = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
};

export const getAppleKeyFromAsync = async (key: string) => {
    return await AsyncStorage.getItem(key);
};

export const clearAppleKeyAsync = async () => {
    await AsyncStorage.clear();
};