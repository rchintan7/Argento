import { axiosInstance } from './../services/api/api';
import { constant } from './config';

//! USER GET API

export const SELF_GET = () => axiosInstance.get(constant.getProfile)

//! AUTH API

export const LOGIN_POST = (data: any) => axiosInstance.post(constant.signIn, data)