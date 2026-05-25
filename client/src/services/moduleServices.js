import api from '../api/axiosInstance';

export const feesService = {
  getStudentFees: (studentId) => api.get(`/fees/student/${studentId}`),
  payFee: (feeId, paymentData) => api.post(`/fees/${feeId}/pay`, paymentData),
  getAll: (params) => api.get('/fees', { params }),
  createRecord: (data) => api.post('/fees', data),
  downloadReceipt: (receiptId) => api.get(`/fees/receipt/${receiptId}`, { responseType: 'blob' }),
};

export const hostelService = {
  apply: (data) => api.post('/hostel/apply', data),
  getMyApplication: () => api.get('/hostel/my-application'),
  applyLeave: (data) => api.post('/hostel/leave', data),
  getAll: () => api.get('/hostel/all'),
  approve: (id, data) => api.put(`/hostel/${id}/approve`, data),
  reject: (id, data) => api.put(`/hostel/${id}/reject`, data),
  approveLeave: (id) => api.put(`/hostel/leave/${id}/approve`),
};

export const libraryService = {
  getBooks: (params) => api.get('/library/books', { params }),
  searchBooks: (query) => api.get('/library/search', { params: { q: query } }),
  getIssuedBooks: () => api.get('/library/issued'),
  getEbooks: () => api.get('/library/ebooks'),
  issueBook: (data) => api.post('/library/issue', data),
  returnBook: (issueId) => api.put(`/library/return/${issueId}`),
  addBook: (data) => api.post('/library/books', data),
};

export const transportService = {
  getRoutes: () => api.get('/transport/routes'),
  requestTransport: (data) => api.post('/transport/request', data),
  getMyRequest: () => api.get('/transport/my-request'),
  approveRequest: (id) => api.put(`/transport/${id}/approve`),
  addRoute: (data) => api.post('/transport/routes', data),
};

export const complaintService = {
  create: (data) => api.post('/complaints', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMy: () => api.get('/complaints/mine'),
  getAll: (params) => api.get('/complaints', { params }),
  reply: (id, reply) => api.put(`/complaints/${id}/reply`, { reply }),
  resolve: (id) => api.put(`/complaints/${id}/resolve`),
  updateStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }),
};

export const feedbackService = {
  createForm: (data) => api.post('/feedback/forms', data),
  getActiveForms: () => api.get('/feedback/forms/active'),
  submit: (formId, data) => api.post(`/feedback/forms/${formId}/submit`, data),
  getAnalytics: (formId) => api.get(`/feedback/forms/${formId}/analytics`),
  getAllForms: () => api.get('/feedback/forms'),
};

export const certificateService = {
  request: (data) => api.post('/certificates/request', data),
  getMy: () => api.get('/certificates/mine'),
  getAll: () => api.get('/certificates/all'),
  approve: (id) => api.put(`/certificates/${id}/approve`),
  reject: (id, remarks) => api.put(`/certificates/${id}/reject`, { remarks }),
  download: (id) => api.get(`/certificates/${id}/download`, { responseType: 'blob' }),
};

export const attendanceService = {
  mark: (data) => api.post('/academic/attendance', data),
  getMy: () => api.get('/academic/attendance/mine'),
  getClass: (params) => api.get('/academic/attendance/class', { params }),
  getReport: (params) => api.get('/academic/attendance/report', { params }),
};

export const notificationService = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};
