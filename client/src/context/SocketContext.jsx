import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

// ─── Context ──────────────────────────────────────────────────────────────────

const SocketContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * SocketProvider
 *
 * Manages a Socket.io connection that is tied to the authenticated user.
 * - Connects only when the user is authenticated.
 * - Registers the user with the server via the 'register' event.
 * - Listens for 'notification' events and prepends them to a local state array.
 * - Disconnects and cleans up on logout or unmount.
 *
 * Exposed via useSocket():
 *   socket        – the raw socket instance (null if not connected)
 *   notifications – array of notification objects { _id, title, message, type, isRead, createdAt, … }
 *   unreadCount   – number of notifications where isRead === false
 *   markAllRead   – sets all notifications as read in local state
 *   markOneRead   – marks a single notification as read by id
 */
export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Keep a stable ref to the socket so cleanup functions can access the latest instance
  const socketRef = useRef(null);

  // ── Connect / Disconnect logic ───────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !user?._id) {
      // Not authenticated — disconnect any existing socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    // Connect to the API URL (Vite environment variable or same origin fallback)
    const newSocket = io(import.meta.env.VITE_API_URL || '', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // ── Event Handlers ───────────────────────────────────────────────────
    newSocket.on('connect', () => {
      console.log('[Socket] Connected:', newSocket.id);
      // Register this user so the server knows which socket belongs to whom
      newSocket.emit('register', { userId: user._id });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    newSocket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
      if (err.message.includes('404') || err.message.includes('Not Found') || err.message === 'xhr poll error') {
        console.log('[Socket] Disabling reconnection attempts (Serverless environment detected).');
        newSocket.disconnect();
      }
    });

    newSocket.on('notification', (notification) => {
      // Prepend newest notification to the list
      setNotifications((prev) => [notification, ...prev]);
      // Increment unread count only if the incoming notification is unread
      if (!notification.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('connect_error');
      newSocket.off('notification');
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [isAuthenticated, user?._id]); // Re-run only when auth state or userId changes

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Mark every notification in local state as read and reset the badge count.
   * Pair with an API call in the caller component to persist on the server.
   */
  const markAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  /**
   * Mark a single notification as read by its _id.
   *
   * @param {string} id – the notification's _id
   */
  const markOneRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // ── Context value ─────────────────────────────────────────────────────────
  const value = {
    socket,
    notifications,
    unreadCount,
    markAllRead,
    markOneRead,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useSocket
 *
 * Returns the current socket context.
 * Must be called inside a component that is a descendant of <SocketProvider>.
 *
 * @returns {{ socket, notifications, unreadCount, markAllRead, markOneRead }}
 */
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a <SocketProvider>');
  }
  return context;
};

export default SocketContext;
