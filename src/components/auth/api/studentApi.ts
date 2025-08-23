import axios from 'axios';
import {
    ADD_DEGREE,
    DELETE_STUDENT,
    GET_DEGREES,
    GET_STUDENTS,
    UPDATE_DEGREE,
    DELETE_DEGREE,
    CREATE_STUDENT,
    UPDATE_STUDENT,
    GET_STUDENTS_BY_ID,
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

// // Create a new hostel
// export const createHostel = async (hostelData: any): Promise<ApiResponse<any>> => {
//     try {
//         const response = await apiClient.post(CREATE_HOSTEL, hostelData);
//         return response.data;
//     } catch (error) {
//         if (axios.isAxiosError(error) && error.response) {
//             throw error.response.data;
//         }
//         throw error;
//     }
// };

// Get all hostels with filters


export const AddStudents = async (data: any): Promise<ApiResponse<any>> => {
    try {

        const response: any = await apiClient.post(CREATE_STUDENT, data)
        return response.data

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }

}

export const updateStudents = async (data: any): Promise<ApiResponse<any>> => {
    try {

        const response: any = await apiClient.put(UPDATE_STUDENT, data)
        return response.data

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }

}

export const getStudents = async (): Promise<ApiResponse<[]>> => {
    try {
        const response = await apiClient.get(GET_STUDENTS);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};


export const getStudentById = async (studentId:any): Promise<ApiResponse<[]>> => {
    try {
        const response = await apiClient.get(GET_STUDENTS_BY_ID, {data:studentId});
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

export const deleteStudent = async (studentId: string): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.delete(DELETE_STUDENT, {
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


// Create degree and manage theri routes 

export const createDegree = async (data: any): Promise<ApiResponse<any>> => {
    try {

        const response: any = await apiClient.post(ADD_DEGREE, data)
        return response.data

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }

}

export const updateDegree = async (data: any) => {
    try {

        const response: any = await apiClient.put(UPDATE_DEGREE, data)
        return response.data

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }

}

export const getAllDegrees =  async (page: number, pageSize: number): Promise<ApiResponse<any>> => {
    console.log('Fetching all rooms with pagination:', { page, pageSize });
    try {
        const response = await apiClient.get(GET_DEGREES, { params: { page, pageSize } });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

export const deleteDegree =  async (deleteDegreeID:any): Promise<ApiResponse<any>> => {
    console.log('Fetching all rooms with pagination:', { deleteDegreeID});
    try {
        const response = await apiClient.delete(DELETE_DEGREE, { data: { deleteDegreeID} });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};
