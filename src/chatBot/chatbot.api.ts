import axios from 'axios';
import { CHATBOT_API, GET_AI_CHAT } from '../components/auth/api/routes';


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


export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}


export const chatBotApi = async (data: any): Promise<ApiResponse<any>> => {
    console.log("apicdscmsdcsd", data)
    try {
        const response: any = await apiClient.post(CHATBOT_API, data)
        return response.data

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }

}


export const getAiChat = async (userId: any): Promise<ApiResponse<[]>> => {
    console.log("Fetching AI chat data for user:", userId);
    try {
        const response = await apiClient.get(`${GET_AI_CHAT}?userId=${userId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};



