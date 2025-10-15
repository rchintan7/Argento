import { axiosInstance } from './../services/api/api';
import { constant } from './config';

//! USER API

export const SELF_ME_GET = () => axiosInstance.get(constant.getProfile)
export const SELF_GET = () => axiosInstance.get(constant.getSocial)

//! AUTH API

export const LOGIN_POST = (data: any) => axiosInstance.post(constant.signIn, data)

//! QUESTIONS API

export const QUESTIONS_GET = () => axiosInstance.get(constant.getQuestions)
export const QUESTIONS_PUT = (data: any) => axiosInstance.post(constant.postQuestions, data)

//! ACTIVITIES API

export const ACTIVITIES_GET = () => axiosInstance.get(constant.getActivities)
export const ACTIVITIES_POST = (data: any) => axiosInstance.post(constant.postActivities, data)