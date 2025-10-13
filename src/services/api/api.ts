import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from './navigation_service';
import { constant } from '../config';

const axiosInstance = axios.create({
    baseURL: constant.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15 * 1000,
    timeoutErrorMessage: 'oops , request timout'
});

axiosInstance.interceptors.request.use(
    async request => {
        try {
            let auth_token;
            if (request.url === '/api/v1/users') {
            } else {
                auth_token = await AsyncStorage.getItem('auth_token');
            }
            if (auth_token && auth_token != null) {
                auth_token = 'Bearer ' + auth_token;
                console.log('Token -> ', auth_token);
                request.headers.Authorization = auth_token;
            }
        } catch (error: any) {
            console.warn("QUERY ERROR TRY CATCH", error.message);
        }
        return request;
    }
);

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    (error: any) => {
        console.warn("AXIOS ERROR", error.response.data);
        if (error.response.data.message === 'Unauthenticated.') {
            NavigationService.navigate('SignInScreen', {});
        }
        if (error.response) return Promise.reject(error.response.data);
        if (error.request) return Promise.reject(error.request);
        return Promise.reject(error.message);
    }
);

export { axiosInstance };
