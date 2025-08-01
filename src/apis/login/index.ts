import apiClient from '../../utils/axios';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  username: string;
  accessToken: string;
  refreshToken: string;
  role: string;
  fullname: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
  return response.data;
};