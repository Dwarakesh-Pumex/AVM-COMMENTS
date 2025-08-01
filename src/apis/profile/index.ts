import type { Users } from "../../types/users";
import apiClient from "../../utils/axios";
import axios from 'axios';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}


export const fetchUser = async (): Promise<Users> => {
  try {
    const res = await apiClient.get<ApiResponse<Users>>('/user/me');
    return res.data.data;                           
  } catch (error: unknown) {
    const msg =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : 'Failed to fetch user details. Please try again.';
    throw new Error(msg);
  }
};