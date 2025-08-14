import axios from 'axios';
import {
    CREATE_PAYMENT_TRASACTION,
    CREATE_PAYMENT_ORDER,
    VERIFY_PAYMENT_ORDER,
    GET_PAYMENT_BY_ID,

} from './routes';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    code:any,
    payment_url:any,
    payment:any,
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Create a new hostel
export const createPaymentTransaction = async (transactionData: any): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.post(CREATE_PAYMENT_TRASACTION, transactionData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

export const createPaymentOrder = async (transactionData: any): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.post(CREATE_PAYMENT_ORDER, transactionData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

export const VerifyPayment = async (transactionData: any): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.post(VERIFY_PAYMENT_ORDER, transactionData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

export const getPaymentByID = async (studentId: any): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get(GET_PAYMENT_BY_ID, {data:studentId});
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};







