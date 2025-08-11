import axios from 'axios';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000,
});

export const STATUS_SUCCESS = 'success';
export const STATUS_ERROR = 'error';
export const STATUS_LOADING = 'pending';

export type ResponseStatus =
  | typeof STATUS_SUCCESS
  | typeof STATUS_ERROR
  | typeof STATUS_LOADING;
