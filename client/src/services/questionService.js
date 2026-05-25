import api from '../api/axiosInstance';

const questionService = {
  create: (data) => api.post('/academic/questions', data),
  submit: (id) => api.put(`/academic/questions/${id}/submit`),
  getMyQuestions: () => api.get('/academic/questions/mine'),
  getAll: () => api.get('/academic/questions'),
  approve: (id, comment) => api.put(`/academic/questions/${id}/approve`, { comment }),
  reject: (id, comment) => api.put(`/academic/questions/${id}/reject`, { comment }),
  getById: (id) => api.get(`/academic/questions/${id}`),
  update: (id, data) => api.put(`/academic/questions/${id}`, data),
};

export default questionService;
