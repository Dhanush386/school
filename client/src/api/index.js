import axiosInstance from '../api/axiosInstance';

/**
 * Axios instance for all API calls.
 * Configured with:
 *  - baseURL: /api
 *  - Request interceptor: attaches Bearer token from localStorage
 *  - Response interceptor: handles 401 → redirect to /login
 *  - Network error handling
 */

const BASE_URL = '/api';

export default axiosInstance;
