import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * AuthProvider
 *
 * Wraps the application and exposes authentication state and actions
 * to every child component via the useAuth() hook.
 *
 * State
 * ─────
 *   user            – decoded user object from localStorage (or null)
 *   token           – raw JWT string (or null)
 *   loading         – true while rehydrating from localStorage on first mount
 *   isAuthenticated – derived boolean: !!token && !!user
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Rehydrate from localStorage on first mount ───────────────────────────
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('erp_token');
      const storedUser  = localStorage.getItem('erp_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      // Corrupted localStorage — clear it
      console.error('[AuthContext] Failed to rehydrate session:', err);
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_user');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Derived flag ─────────────────────────────────────────────────────────
  const isAuthenticated = Boolean(token && user);

  // ── login ─────────────────────────────────────────────────────────────────
  /**
   * Authenticate against the backend.
   *
   * @param {string} loginId  – student / staff login ID
   * @param {string} password – plain-text password (HTTPS in production)
   * @returns {Promise<object>} – server response data
   *   Common fields: { token, user, mustChangePassword }
   */
  const login = useCallback(async (loginId, password) => {
    const response = await api.post('/auth/login', { loginId, password });
    const { token: newToken, user: newUser } = response.data;

    // Persist credentials
    localStorage.setItem('erp_token', newToken);
    localStorage.setItem('erp_user', JSON.stringify(newUser));

    // Update state
    setToken(newToken);
    setUser(newUser);

    return response.data; // caller can inspect mustChangePassword, etc.
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────
  /**
   * Clear the current session from state and localStorage.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('erp_token');
    localStorage.removeItem('erp_user');
    setToken(null);
    setUser(null);
  }, []);

  // ── updateUser ───────────────────────────────────────────────────────────
  /**
   * Merge partial data into the current user object.
   * Useful after a profile update or password change.
   *
   * @param {object} data – fields to merge into user
   */
  const updateUser = useCallback((data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('erp_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ── Context value ─────────────────────────────────────────────────────────
  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useAuth
 *
 * Returns the current auth context.
 * Must be called inside a component that is a descendant of <AuthProvider>.
 *
 * @returns {{ user, token, loading, isAuthenticated, login, logout, updateUser }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
};

export default AuthContext;
