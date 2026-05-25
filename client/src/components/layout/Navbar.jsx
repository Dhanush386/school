import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdSearch, MdNotifications, MdPerson, MdLogout,
  MdSettings, MdKeyboardArrowDown, MdClose,
  MdCheckCircle, MdInfo, MdWarning, MdError,
  MdSchool,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { ROLE_LABELS, ROLE_COLORS } from '../../constants/roles';
import { format } from 'date-fns';

const NotificationIcon = ({ type }) => {
  const icons = {
    success: <MdCheckCircle className="text-green-400" />,
    info: <MdInfo className="text-blue-400" />,
    warning: <MdWarning className="text-amber-400" />,
    error: <MdError className="text-red-400" />,
  };
  return icons[type] || icons.info;
};

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex flex-col items-end">
      <span className="text-white font-semibold text-sm leading-tight tabular-nums">
        {format(time, 'hh:mm:ss a')}
      </span>
      <span className="text-slate-400 text-xs">
        {format(time, 'EEEE, dd MMM yyyy')}
      </span>
    </div>
  );
};

const Navbar = ({ sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllRead } = useSocket();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLeft = sidebarCollapsed ? 72 : 260;

  return (
    <motion.header
      animate={{ left: navLeft }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 right-0 z-30 h-16 flex items-center px-4 lg:px-6 gap-4"
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Institution Name */}
      <div className="hidden md:flex items-center gap-2 mr-2">
        <MdSchool className="text-primary-400 text-xl" />
        <span className="text-white font-semibold text-sm tracking-wide">
          International School
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md relative">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
          searchFocused
            ? 'bg-white/10 border-primary-500/50 shadow-lg shadow-primary-900/20'
            : 'bg-white/5 border-white/10 hover:border-white/20'
        }`}>
          <MdSearch className="text-slate-400 text-lg flex-shrink-0" />
          <input
            type="text"
            placeholder="Search students, modules, reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-white text-sm placeholder-slate-500 flex-1 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <MdClose className="text-slate-400 hover:text-white text-sm" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Live Clock */}
        <LiveClock />

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all"
          >
            <MdNotifications className="text-xl" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 rounded-2xl border overflow-hidden shadow-2xl z-50"
                style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <h3 className="text-white font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-primary-400 text-xs hover:text-primary-300"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <MdNotifications className="text-slate-600 text-3xl mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notif) => (
                      <div
                        key={notif._id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${!notif.isRead ? 'bg-primary-900/20' : ''}`}
                      >
                        <div className="text-lg mt-0.5 flex-shrink-0">
                          <NotificationIcon type={notif.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">{notif.title}</p>
                          <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-slate-600 text-xs mt-1">
                            {format(new Date(notif.createdAt), 'dd MMM, hh:mm a')}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => { setNotifOpen(false); markAllRead(); }}
                  className="block w-full text-center px-4 py-3 text-primary-400 text-sm hover:text-primary-300 border-t border-white/10 transition-colors"
                >
                  Mark all as read
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-white text-xs font-semibold leading-tight truncate max-w-[100px]">{user?.name}</p>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${ROLE_COLORS[user?.role] || 'bg-slate-700 text-slate-300'}`}>
                {ROLE_LABELS[user?.role] || user?.role}
              </span>
            </div>
            <MdKeyboardArrowDown className={`text-slate-400 text-sm transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-56 rounded-2xl border overflow-hidden shadow-2xl z-50"
                style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white font-semibold text-sm">{user?.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{user?.loginId} • {user?.department}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-colors"
                  >
                    <MdPerson className="text-lg" /> My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-colors"
                  >
                    <MdSettings className="text-lg" /> Settings
                  </Link>
                </div>
                <div className="border-t border-white/10 py-1">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-colors"
                  >
                    <MdLogout className="text-lg" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
