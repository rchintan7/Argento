import { axiosInstance } from './../services/api/api';
import { constant } from './config';

//! USER API

export const SELF_ME_GET = () => axiosInstance.get(constant.getProfile)
export const SELF_GET = () => axiosInstance.get(constant.getSocial)

//! AUTH API

export const LOGIN_POST = (data: any) => axiosInstance.post(constant.signIn, data)

//! QUESTIONS API

export const QUESTIONS_GET = () => axiosInstance.get(constant.getQuestions)
export const QUESTIONS_POST = (data: any) => axiosInstance.post(constant.postQuestions, data)

//! ACTIVITIES API

export const ACTIVITIES_GET = () => axiosInstance.get(constant.getActivities)
export const ACTIVITIES_CREATE_POST = (data: any) => axiosInstance.post(constant.postCreateActivities, data)
export const ACTIVITIES_POST = (data: any) => axiosInstance.post(constant.postActivities, data)

//! JOURNAL API

export const JOURNAL_GET = () => axiosInstance.get(constant.getJournal)
export const JOURNAL_POST = (data: any) => axiosInstance.post(constant.postJournal, data)

//! HISTORY API

export const HISTORY_GET = (date: string) => axiosInstance.get(`${constant.getHistory}limit=100&from_date=${date}&to_date=${date}`)

//! SELFIE API

export const SELFIE_POST = (data: any) => axiosInstance.post(constant.postSelfie, data)