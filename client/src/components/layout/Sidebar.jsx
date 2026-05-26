import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard, MdSchool, MdAssignment, MdHotel,
  MdLocalLibrary, MdFeedback, MdPayment, MdDirectionsBus,
  MdPeople, MdReport, MdChevronLeft, MdChevronRight,
  MdExpandMore, MdExpandLess, MdSettings, MdLogout,
  MdCalendarToday, MdBarChart, MdGavel, MdBook,
  MdQuiz, MdSchedule, MdPerson, MdStar,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { getSidebarMenu } from '../../constants/menuConfig';

const iconMap = {
  MdDashboard, MdSchool, MdAssignment, MdHotel,
  MdLocalLibrary, MdFeedback, MdPayment, MdDirectionsBus,
  MdPeople, MdReport, MdChevronLeft, MdChevronRight,
  MdExpandMore, MdExpandLess, MdSettings, MdLogout,
  MdCalendarToday, MdBarChart, MdGavel, MdBook,
  MdQuiz, MdSchedule, MdPerson, MdStar,
};

const SidebarItem = ({ item, collapsed }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const Icon = iconMap[item.icon] || MdDashboard;
  const hasChildren = item.subItems && item.subItems.length > 0;
  const isActive = hasChildren
    ? item.subItems.some(sub => location.pathname.startsWith(sub.path))
    : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

  useEffect(() => {
    if (isActive && hasChildren) setOpen(true);
  }, [isActive]);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
            ${isActive
              ? 'bg-primary-50 text-primary-700 border border-primary-100'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <span className={`text-xl flex-shrink-0 transition-colors ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
            <Icon />
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate">{item.label}</span>
              <span className="text-slate-500">
                {open ? <MdExpandLess /> : <MdExpandMore />}
              </span>
            </>
          )}
        </button>
        <AnimatePresence>
          {open && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-7 mt-1 space-y-1 border-l border-slate-700/50 pl-3">
                {item.subItems.map(sub => {
                  const SubIcon = iconMap[sub.icon] || MdDashboard;
                  const subActive = location.pathname === sub.path;
                  return (
                    <NavLink
                      key={sub.id}
                      to={sub.path}
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200
                        ${subActive
                          ? 'text-primary-700 bg-primary-100/50'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                      <SubIcon className="text-sm flex-shrink-0" />
                      <span className="truncate">{sub.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={({ isActive: navActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
        ${navActive
          ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 border border-primary-200 shadow-sm shadow-primary-100'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`
      }
    >
      {({ isActive: navActive }) => (
        <>
          {navActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-400 rounded-r-full"
            />
          )}
          <span className={`text-xl flex-shrink-0 transition-colors ${navActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
            <Icon />
          </span>
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
};

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const menuItems = getSidebarMenu(user?.role);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col"
      style={{
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-900/50">
          <MdSchool className="text-white text-xl" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-slate-900 font-bold text-sm leading-tight whitespace-nowrap">EduManage Pro</p>
              <p className="text-slate-500 text-xs whitespace-nowrap">International School ERP</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Info */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-slate-900 text-xs font-semibold truncate">{user?.name}</p>
                <p className="text-slate-500 text-xs truncate">{user?.loginId}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {menuItems.map((section) => (
          <div key={section.section} className="mb-4">
            {!collapsed && (
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 px-3 mb-2">
                {section.section}
              </p>
            )}
            {collapsed && <div className="border-t border-slate-100 my-2" />}
            <div className="space-y-0.5">
              {section.items.map(item => (
                <SidebarItem key={item.id} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-3 border-t border-slate-100 space-y-1">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm transition-all"
        >
          <MdSettings className="text-xl flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 text-sm transition-all"
        >
          <MdLogout className="text-xl flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-indigo-600 border border-indigo-500 rounded-full flex items-center justify-center text-white hover:bg-indigo-500 transition-colors shadow-lg"
      >
        {collapsed ? <MdChevronRight className="text-sm" /> : <MdChevronLeft className="text-sm" />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
