import api from '../api/axiosInstance';

const authService = {
  login: async (loginId, password) => {
    const response = await api.post('/auth/login', { loginId, password });
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  },

  forgotPassword: async (loginId) => {
    const response = await api.post('/auth/forgot-password', { loginId });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
