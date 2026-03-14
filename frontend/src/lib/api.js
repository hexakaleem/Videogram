import axios from 'axios';

const API_BASE = '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401 - backend sets new tokens in httpOnly cookies
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post('/users/refreshtokens', {});
        const accessToken = res.data?.data?.accessToken;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  register: (formData) => api.post('/users/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  login: (data) => api.post('/users/login', data),
  logout: () => api.get('/users/logout'),
  refreshToken: () => api.post('/users/refreshtokens', {}, { withCredentials: true }),
  getCurrentUser: () => api.get('/users/currentuser'),
  changePassword: (data) => api.post('/users/changepassword', data),
  updateDetails: (data) => api.patch('/users/updatedetails', data),
  updateAvatar: (formData) => api.post('/users/updateavatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateCoverImage: (formData) => api.post('/users/updatecoverimage', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// User endpoints
export const userApi = {
  getSubscriptionStats: () => api.get('/users/subscriptions'),
  getChannelProfile: (username) => api.get(`/users/channel/${username}`),
  getWatchHistory: () => api.get('/users/watch-history'),
  getAllChannels: () => api.get('/users/all-channels'),
  addToWatchHistory: (videoId) => api.post(`/users/watch-history/${videoId}`),
  toggleSubscription: (channelId) => api.post(`/users/toggle-subscription/${channelId}`),
};

// Video endpoints
export const videoApi = {
  getAllVideos: () => api.get('/videos'),
  publishVideo: (data) => api.post('/videos/publish', data),
};

export default api;
