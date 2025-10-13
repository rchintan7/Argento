import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface UserState {
    token: string | undefined;
    isLogin: boolean;
    userData: any;
}

export interface RootState {
    user: UserState;
}

// Only persist the user slice
const userPersistConfig = {
    key: 'user',
    storage: AsyncStorage,
}

const rootReducer = combineReducers({
    // user: persistReducer(userPersistConfig, userDataReducer),
});

const store = configureStore({
    reducer: rootReducer,
});

const persistor = persistStore(store);

export { store, persistor };