import axios from 'axios';

// API URL - environment variable dan yoki default localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Axios instance yaratish
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - token qo'shish
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('piknic_token');
        const adminToken = localStorage.getItem('piknic_admin_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - xatolarni boshqarish
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token muddati tugagan
            localStorage.removeItem('piknic_token');
            localStorage.removeItem('piknic_admin_token');
            localStorage.removeItem('piknic_user');

            if (window.location.pathname !== '/login' &&
                window.location.pathname !== '/admin/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
export { API_URL };