import axios from 'axios';
import {
    CREATE_ANNOUNCEMENT,
    DELETE_ANNOUNCEMENT,
    GET_ANNOUNCEMENT,
    UPDATE_ANNOUNCEMENT,
} from './routes';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ,
    withCredentials: true
});



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

const token = localStorage.getItem('token');
console.log('Sending token:', token);
console.log('GET_ANNOUNCEMENT', GET_ANNOUNCEMENT);


export const createAnnouncement = async (data: any): Promise<ApiResponse<any>> => {
    console.log("apicdscmsdcsd",data )
    try {

        const response: any = await apiClient.post(CREATE_ANNOUNCEMENT, data)
        return response.data

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }

}

export const updateAnnouncement= async (data: any): Promise<ApiResponse<any>> => {
    try {

        const response: any = await apiClient.put(UPDATE_ANNOUNCEMENT, data)
        return response.data

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }

}

// export const getAnnouncement = async (): Promise<ApiResponse<[]>> => {
//     try {
//         const response = await apiClient.get(GET_ANNOUNCEMENT);
//         return response.data;
//     } catch (error) {
//         if (axios.isAxiosError(error) && error.response) {
//             throw error.response.data;
//         }
//         throw error;
//     }
// };

export const getAnnouncement = await axios.get(
  'https://hostel-management-back-end-vsd4.vercel.app/api/announcement/getAllAnouncement',
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

export const deleteAnnouncement = async (studentId: string): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.delete(DELETE_ANNOUNCEMENT, {
            data: { studentId }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

