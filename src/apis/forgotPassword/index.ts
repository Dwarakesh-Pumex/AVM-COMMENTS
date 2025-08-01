import apiClient from "../../utils/axios";


interface ForgotPasswordRequest {
  username: string;
}


interface ForgotPasswordResponse {
  message: string;  
}

export const forgotPassword = async (
  payload: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ForgotPasswordResponse>(
    '/user/forgot-password',
    payload
  );

  return response.data; 
};
