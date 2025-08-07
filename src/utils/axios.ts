import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: 'http://34.224.38.223:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  
  failedQueue = [];
};

const refreshToken = async (): Promise<string> => {
  const refreshTokenValue = Cookies.get('refreshToken');
  const username = Cookies.get('username') || '';
  const fullname = Cookies.get('fullname') || '';
  const role = Cookies.get('role') || '';
  const accessToken = Cookies.get('accessToken') || '';

  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`http://34.224.38.223:8080/api/auth/token`, {
      username,
      fullname,
      role,
      accessToken,
      refreshToken: refreshTokenValue
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

    const cookieOptions = Cookies.get('accessToken') ? { expires: 7 } : {};
    Cookies.set('accessToken', newAccessToken, cookieOptions);
    Cookies.set('refreshToken', newRefreshToken, cookieOptions);

    return newAccessToken;
  } catch (error) {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('role');
    Cookies.remove('fullname');
    Cookies.remove('username');
    
    window.location.href = '/login';
    
    throw error;
  }
};

apiClient.interceptors.request.use(
  (config) => {
    // Authentication token
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
