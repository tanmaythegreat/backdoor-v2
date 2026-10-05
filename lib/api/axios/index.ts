import { API_BASE_URL, BACKEND_URL } from '@/lib/constants';
import axios, { AxiosInstance } from 'axios';
import { createAuthenticatedServerAxios } from './server-axios';
import { createAuthenticatedClientAxios } from './client-axios';
import { isServer } from '@tanstack/react-query';

export function getUnauthenticatedAxios(baseURL: string = BACKEND_URL) {
  const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
  });

  return axiosInstance;
}

export async function getAuthenticatedAxios(): Promise<AxiosInstance> {
  if (isServer) {
    return await createAuthenticatedServerAxios();
  } else {
    return await createAuthenticatedClientAxios();
  }
}
