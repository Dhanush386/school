import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdHome, MdSearchOff } from 'react-icons/md';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <MdSearchOff className="text-slate-400 text-5xl" />
        </div>
        <h1 className="text-white text-6xl font-black mb-2">404</h1>
        <p className="text-slate-400 text-lg mb-2">Page Not Found</p>
        <p className="text-slate-600 text-sm mb-8">The page you're looking for doesn't exist or you don't have access to it.</p>
        <button onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors mx-auto">
          <MdHome /> Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
