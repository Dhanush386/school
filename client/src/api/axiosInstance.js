import axios from 'axios';

/**
 * Pre-configured Axios instance for the School ERP API.
 *
 * - Base URL : /api  (proxied by Vite dev server to the Express backend)
 * - Timeout  : 30 s
 * - Default Content-Type: application/json
 *
 * Request interceptor  — attaches the JWT stored in localStorage.
 * Response interceptor — on 401, clears credentials and redirects to /login.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('erp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  // Pass through successful responses unchanged
  (response) => response,

  // Handle errors
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      // Token expired or invalid (but NOT a failed login attempt) — clear credentials
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_user');

      // Redirect to login only if not already there (prevents redirect loop)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
