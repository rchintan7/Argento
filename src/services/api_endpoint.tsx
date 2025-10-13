import axios from 'axios';
import { axiosInstance } from './../services/api/api';
import { constant } from './config';

//! USER GET API

export const SELF_GET = () => axiosInstance.get(constant.getProfile)

//! AUTH API

export const LOGIN_POST = (data: any, userIdToken: any) => axios.post(constant.signIn, data, {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${userIdToken}`
    }
})