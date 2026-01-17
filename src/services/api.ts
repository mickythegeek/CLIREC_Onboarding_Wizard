import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    register: (data: { email: string; password: string; fullName: string }) =>
        api.post('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),

    getCurrentUser: () => api.get('/auth/me'),
};

// Requirements API
export const requirementsApi = {
    getMyRequirements: () => api.get('/requirements'),

    getRequirement: (id: number) => api.get(`/requirements/${id}`),

    createRequirement: (data: {
        clientName: string;
        clientId: string;
        region: string;
        responseJson: string;
        status?: string;
    }) => api.post('/requirements', data),

    updateRequirement: (id: number, data: {
        clientName?: string;
        clientId?: string;
        region?: string;
        responseJson?: string;
        status?: string;
    }) => api.put(`/requirements/${id}`, data),

    deleteRequirement: (id: number) => api.delete(`/requirements/${id}`),

    downloadRequirement: (id: number) => api.get(`/requirements/download/${id}`, {
        responseType: 'blob',
    }),
};

// Admin API
export const adminApi = {
    getAllRequirements: () => api.get('/admin/requirements'),

    getRequirement: (id: number) => api.get(`/admin/requirements/${id}`),

    updateRequirement: (id: number, data: {
        clientName?: string;
        clientId?: string;
        region?: string;
        responseJson?: string;
        status?: string;
    }) => api.put(`/admin/requirements/${id}`, data),

    updateStatus: (id: number, status: string) =>
        api.put(`/admin/requirements/${id}/status`, { status }),

    lockRequirement: (id: number) =>
        api.put(`/admin/requirements/${id}/lock`),

    unlockRequirement: (id: number) =>
        api.put(`/admin/requirements/${id}/unlock`),
};

export default api;
