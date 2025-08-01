import apiClient from '../../utils/axios';
import type { ChangePasswordRequest } from '../../types/changePassword';

export const changePassword = async (data: ChangePasswordRequest): Promise<string> => {
  try {
    const response = await apiClient.put<string>('/user/change-password', data);
    return response.data;
  } catch {
    throw new Error('Failed to change password. Please try again.');
  }
};