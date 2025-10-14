import axios from 'axios';
import { axiosInstance } from './../services/api/api';
import { constant } from './config';

//! USER GET API

export const SELF_GET = () => axiosInstance.get(constant.getSocial)

//! AUTH API

export const LOGIN_POST = (data: any) => axiosInstance.post(constant.signIn, data)

//! QUESTIONS GET API

export const QUESTIONS_GET = () => axiosInstance.get(constant.getQuestions)