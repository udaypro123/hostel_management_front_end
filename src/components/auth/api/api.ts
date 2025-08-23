import {
    REGISTER_USER,
    LOGIN_USER
} from './routes';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})


export const registerUser = async (userData:any) => {
    try {
        const response = await apiClient.post(REGISTER_USER, userData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

export const loginUser = async (credentials:any) => {
    try {
        const response = await apiClient.post(LOGIN_USER, credentials);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await apiClient.post('/api/auth/logout');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};