import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        localStorage.setItem('token', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
};

// Shop APIs
export const shopAPI = {
  register: (data) => api.post('/shops', data),
  getAll: (params) => api.get('/shops', { params }),
  getMyShop: () => api.get('/shops/my-shop'),
  getById: (id) => api.get(`/shops/${id}`),
  update: (id, data) => api.put(`/shops/${id}`, data),
  delete: (id) => api.delete(`/shops/${id}`),
  getNearby: (params) => api.get('/shops/nearby', { params })
};

// Offer APIs
export const offerAPI = {
  create: (data) => api.post('/offers', data),
  getAll: (params) => api.get('/offers', { params }),
  getNearby: (params) => api.get('/offers/nearby', { params }),
  getById: (id) => api.get(`/offers/${id}`),
  update: (id, data) => api.put(`/offers/${id}`, data),
  delete: (id) => api.delete(`/offers/${id}`),
  getMyOffers: () => api.get('/offers/my/offers')
};

// Admin APIs
export const adminAPI = {
  getShopRequests: (params) => api.get('/admin/shop-requests', { params }),
  approveShop: (id) => api.put(`/admin/approve-shop/${id}`),
  rejectShop: (id, reason) => api.put(`/admin/reject-shop/${id}`, { reason }),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllOffers: (params) => api.get('/admin/offers', { params }),
  deleteOffer: (id) => api.delete(`/admin/offers/${id}`),
  getAnalytics: () => api.get('/admin/analytics')
};

export default api;

