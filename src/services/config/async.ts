import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveAppleKeyInAsync = async (key: string, value: string) => {
    console.log(value);
    await AsyncStorage.setItem(key, value);
};

export const getAppleKeyFromAsync = async (key: string) => {
    return await AsyncStorage.getItem(key);
};

export const clearAppleKeyAsync = async () => {
    await AsyncStorage.clear();
};