import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginId.trim() || !password.trim()) {
      setError('Please enter your Username and Password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await login(loginId.trim().toUpperCase(), password);
      if (result?.mustChangePassword) {
        toast.success('Please change your password to continue.');
        navigate('/change-password', { replace: true });
      } else {
        toast.success(`Welcome back, ${result?.name || 'User'}!`);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid Username or password.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex font-sans bg-[#f4f6f9] text-slate-800">
      {/* Left side image */}
      <div 
        className="hidden lg:block lg:w-[65%] h-full relative bg-slate-900" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-[35%] h-full flex flex-col justify-center items-center px-6 relative bg-[#f4f6f9] overflow-y-auto">
        
        {/* Top text */}
        <div className="absolute top-4 left-0 right-0 text-center px-4">
          <p className="text-[10px] md:text-xs font-semibold text-slate-600 uppercase tracking-wide">
            VIDHYA VIKAS EDUCATIONAL TRUST GROUP
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col items-center mt-6">
          {/* Logo */}
          <img src="/logo.jpeg" alt="Vidhya Vikas Logo" className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-full mb-3" />
          
          <div className="w-full overflow-hidden mb-4">
            <h1 className="text-lg md:text-xl font-bold text-slate-700 uppercase tracking-wider animate-marquee whitespace-nowrap">
              VIDHYA VIKAS MATRIC HR. SEC. SCHOOL
            </h1>
          </div>

          {/* Login Card */}
          <div className="bg-white p-6 md:p-8 rounded shadow-lg w-full border border-slate-200">
            <h2 className="text-center font-bold text-slate-600 mb-5 text-sm md:text-[15px]">
              Sign in to start your session
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
               
               <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-1">
                   Username <span className="text-red-500">*</span>
                 </label>
                 <input 
                   type="text"
                   value={loginId}
                   onChange={(e) => setLoginId(e.target.value.toUpperCase())}
                   placeholder="e.g. STU001"
                   className="w-full border border-blue-300 rounded px-3 py-2 bg-blue-50/50 focus:outline-none focus:border-blue-500 transition-colors text-sm text-slate-800"
                 />
               </div>
               
               <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-1">
                   Password <span className="text-red-500">*</span>
                 </label>
                 <input 
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   className="w-full border border-blue-300 rounded px-3 py-2 bg-blue-50/50 focus:outline-none focus:border-blue-500 transition-colors text-sm text-slate-800"
                 />
               </div>

               <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs font-semibold text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-[#003cb3] hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors mt-2 text-sm disabled:opacity-70"
               >
                 {loading ? 'Signing in...' : 'Sign in'}
               </button>
               
               <button 
                 type="button" 
                 onClick={() => toast('Contact admin to reset your password.', { icon: 'ℹ️' })}
                 className="w-full bg-[#003cb3] hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors mt-2 text-sm"
               >
                 Forgot Password
               </button>

               <button 
                 type="button" 
                 onClick={() => navigate('/')}
                 className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded transition-colors mt-2 text-sm"
               >
                 Back to Home Page
               </button>
            </form>
          </div>
          
          {/* Footer Text */}
          <p className="text-center text-[9px] md:text-[10px] text-slate-500 mt-6 mb-2">
             Copyright © 2012 - 2026 | All rights reserved | Powered by Vidhya Vikas
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
