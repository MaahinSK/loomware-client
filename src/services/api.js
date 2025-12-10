import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://loomware-serverv2.vercel.app/api'
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('[API] Request to:', config.url, '| Token exists:', !!token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('[API] 401 Error on:', error.config.url);
            // Handle unauthorized access
            localStorage.removeItem('token');
            // Don't redirect if checking auth status fails (user just isn't logged in)
            if (!error.config.url.includes('/auth/me')) {
                console.log('[API] Redirecting to login...');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;