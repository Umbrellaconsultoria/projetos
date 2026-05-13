import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3333', // Backend URL
});

api.interceptors.request.use(config => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Redirecionar para login se token inválido
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                // window.location.href = '/login'; // Opcional: auto redirect
            }
        }
        return Promise.reject(error);
    }
);
