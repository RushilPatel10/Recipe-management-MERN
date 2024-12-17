import axios from 'axios';
import config from '../config/config';

const instance = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance; 