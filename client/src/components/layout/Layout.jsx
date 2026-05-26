import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { fadeInUp } from '../../animations/fadeIn';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Navbar sidebarCollapsed={collapsed} />

      <motion.main
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen pt-16"
      >
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="p-4 lg:p-6 max-w-[1600px]"
        >
          {children}
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Layout;
