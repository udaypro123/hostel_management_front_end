import axios from 'axios';
import {
    CREATE_REQUEST,
    DELETE_REQUEST,
    GET_REQUESTS,
    UPDATE_REQUEST,
} from './routes';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ,
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


export const createRequest = async (data: any): Promise<ApiResponse<any>> => {
    console.log("apicdscmsdcsd",data )
    try {

        const response: any = await apiClient.post(CREATE_REQUEST, data)
        return response.data

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }

}

export const updateRequest = async (data: any): Promise<ApiResponse<any>> => {
    try {

        const response: any = await apiClient.put(UPDATE_REQUEST, data)
        return response.data

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }

}

export const getRequests = async (): Promise<ApiResponse<[]>> => {
    try {
        const response = await apiClient.get(GET_REQUESTS);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};


export const deleteRequest = async (requestId: string): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.delete(DELETE_REQUEST, {
            data: { requestId }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

