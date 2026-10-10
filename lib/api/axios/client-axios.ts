/* 
  This is the axios instance for client side queries.
*/

import Cookies from 'js-cookie';
import { API_BASE_URL } from '@/lib/constants';
import axios, { AxiosInstance } from 'axios';

export async function createAuthenticatedClientAxios(): Promise<AxiosInstance> {
  const clientAxios = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
  });

  clientAxios.interceptors.request.use((config) => {
    const cookies = Cookies.get();
    const auth = cookies?.auth;
    if (auth) {
      config.headers.Authorization = `Bearer ${auth}`;
    }
    return config;
  });

  clientAxios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        Cookies.remove('auth');
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );

  return new Promise((resolve) => {
    resolve(clientAxios);
  });
}
