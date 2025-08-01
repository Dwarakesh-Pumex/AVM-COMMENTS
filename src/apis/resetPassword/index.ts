import apiClient from "../../utils/axios";

interface ResetPasswordRequest {
    token:string
    newPassword: string;
}


interface ResetPasswordResponse {
  message: string;  
}

export const resetPassword = async (
  payload: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>(
    '/user/reset-password',
    payload
  );

  return response.data; 
};
