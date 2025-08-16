import axios from 'axios';
import {
    CREATE_HOSTEL,
    GET_HOSTELS,
    UPDATE_HOSTEL,
    DELETE_HOSTEL,
    ADD_ROOM_TO_HOSTEL,
    DELETE_ROOM,
    GET_ALL_ROOMS,
    UPDATE_ROOM_IN_HOSTEL,
} from './routes';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("token", token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})


export interface CreateHostelData {
    hostelName: string;
    address: string;
    capacity: number;
    type?: 'boys' | 'girls' | 'co-ed';
    wardenName?: string;
    wardenEmail?: string;
    wardenPhone?: string;
    description?: string;
    amenities?: string;
    monthlyFees?: number;
    securityDeposit?: number;
    admissionFees?: number;
}

export interface UpdateHostelData extends Partial<CreateHostelData> {}

export interface HostelFilters {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    state?: string;
    type?: string;
    status?: string;
    minFees?: number;
    maxFees?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

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

// Create a new hostel
export const createHostel = async (hostelData: any): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.post(CREATE_HOSTEL, hostelData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

// Get all hostels with filters
export const getHostels = async (): Promise<ApiResponse<[]>> => {
    try {
        const response = await apiClient.get(GET_HOSTELS);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

export const updateHostel = async (hostelData: any): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.put(UPDATE_HOSTEL, hostelData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

// Delete hostel
export const deleteHostel = async (hostelId: string) => {
    console.log('Deleting hostel with ID:', hostelId);
  const response = await apiClient.delete(`${DELETE_HOSTEL}`, { data: { hostelId } });
  return response.data;
}

// add room to hostel
export const addRoomToHostel =  async (hostelData: any): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.post(ADD_ROOM_TO_HOSTEL, hostelData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

export const updateRoomsToHostel =  async (hostelData: any): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.put(UPDATE_ROOM_IN_HOSTEL, hostelData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

export const getAllRooms =  async (page: number, pageSize: number): Promise<ApiResponse<any>> => {
    console.log('Fetching all rooms with pagination:', { page, pageSize });
    try {
        const response = await apiClient.get(GET_ALL_ROOMS, { params: { page, pageSize } });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};

export const deleteRoom =  async (deleteRoomID: any): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.delete(DELETE_ROOM, { data: { deleteRoomID } });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw error;
    }
};



