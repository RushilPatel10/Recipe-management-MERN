import axios from 'axios';
import config from '../config/config';

const instance = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Log request details
    console.log('Request details:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      data: config.data
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log('Response success:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    };
    console.error('Response error details:', errorDetails);
    return Promise.reject(errorDetails);
  }
);

export default instance; 