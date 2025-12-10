import axios from 'axios';

import appConfig from '@/services/appConfig';

export const apiInstance = axios.create({
  baseURL: appConfig.getConfig().API_URL,
  timeout: 1000,
});

export const liveInstance = axios.create({
  headers: {},
});

export const STATUS_SUCCESS = 'success';
export const STATUS_ERROR = 'error';
export const STATUS_LOADING = 'pending';
export const STATUS_IDLE = 'idle';

export type ResponseStatus =
  | typeof STATUS_SUCCESS
  | typeof STATUS_ERROR
  | typeof STATUS_LOADING;
