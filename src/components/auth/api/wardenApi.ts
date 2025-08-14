import axios from 'axios';
import { CREATE_WARDEN, DELETE_WARDENS, GET_WARDENS, GET_WARDENS_ID, UPDATE_WARDENS } from './routes';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});


export const createWarden = async (wardenData: any) => {
  const response = await apiClient.post(CREATE_WARDEN, wardenData);
  return response.data;
}

export const getWardens = async () => {
  const response = await apiClient.get(GET_WARDENS);
  return response.data;
}

export const getWardenById = async (wardenId:any) => {
  console.log("wardenId", wardenId)
  const response = await apiClient.get(GET_WARDENS_ID, {data:wardenId});
  return response.data;
}

export const updateWarden = async ( wardenData: any) => {
  const response = await apiClient.put(`${UPDATE_WARDENS}`, wardenData);
  return response.data;
}
export const deleteWarden = async (wardenId: string) => {
  const response = await apiClient.delete(`${DELETE_WARDENS}`, { data: { wardenId } });
  return response.data;
}

