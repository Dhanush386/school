import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Since ERPs usually auto-generate accounts, this might just send an enquiry or create a guest/temporary user.
      // For now, we simulate a successful registration and redirect to login.
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Registration request submitted successfully! Please wait for admin approval or login credentials.');
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#f4f6f9] text-slate-800">
      {/* Left side image */}
      <div 
        className="hidden lg:block lg:w-[65%] relative bg-slate-900" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-[35%] flex flex-col justify-center items-center px-8 py-6 relative bg-[#f4f6f9] overflow-y-auto">
        
        {/* Top text */}
        <div className="absolute top-6 left-0 right-0 text-center px-4">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
            VIDHYA VIKAS EDUCATIONAL TRUST GROUP
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col items-center mt-12">
          {/* Logo */}
          <img src="/logo.jpeg" alt="Vidhya Vikas Logo" className="w-24 h-24 object-contain mb-4" />
          
          <h1 className="text-xl font-bold text-slate-700 mb-6 uppercase tracking-wider">
            VIDHYA VIKAS ERP
          </h1>

          {/* Signup Card */}
          <div className="bg-white p-8 rounded shadow-lg w-full border border-slate-200">
            <h2 className="text-center font-bold text-slate-600 mb-6 text-[15px]">
              Register a New Account
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
               
               <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-1">
                   Full Name <span className="text-red-500">*</span>
                 </label>
                 <input 
                   type="text"
                   name="name"
                   value={formData.name}
                   onChange={handleChange}
                   placeholder="e.g. John Doe"
                   className="w-full border border-blue-300 rounded px-3 py-2 bg-blue-50/50 focus:outline-none focus:border-blue-500 transition-colors text-sm text-slate-800"
                 />
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-1">
                   Email Address <span className="text-red-500">*</span>
                 </label>
                 <input 
                   type="email"
                   name="email"
                   value={formData.email}
                   onChange={handleChange}
                   placeholder="john@example.com"
                   className="w-full border border-blue-300 rounded px-3 py-2 bg-blue-50/50 focus:outline-none focus:border-blue-500 transition-colors text-sm text-slate-800"
                 />
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-1">
                   Phone Number
                 </label>
                 <input 
                   type="tel"
                   name="phone"
                   value={formData.phone}
                   onChange={handleChange}
                   placeholder="+91 98765 43210"
                   className="w-full border border-blue-300 rounded px-3 py-2 bg-blue-50/50 focus:outline-none focus:border-blue-500 transition-colors text-sm text-slate-800"
                 />
               </div>
               
               <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-1">
                   Password <span className="text-red-500">*</span>
                 </label>
                 <input 
                   type="password"
                   name="password"
                   value={formData.password}
                   onChange={handleChange}
                   placeholder="••••••••"
                   className="w-full border border-blue-300 rounded px-3 py-2 bg-blue-50/50 focus:outline-none focus:border-blue-500 transition-colors text-sm text-slate-800"
                 />
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-1">
                   Confirm Password <span className="text-red-500">*</span>
                 </label>
                 <input 
                   type="password"
                   name="confirmPassword"
                   value={formData.confirmPassword}
                   onChange={handleChange}
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
                 {loading ? 'Submitting...' : 'Register Account'}
               </button>

               <div className="text-center mt-4">
                 <Link to="/login" className="text-[11px] text-[#003cb3] hover:underline font-bold">
                   Already have an account? Sign in here
                 </Link>
               </div>
            </form>
          </div>
          
          {/* Footer Text */}
          <p className="text-center text-[10px] text-slate-500 mt-6 pb-6">
             Copyright © 2012 - 2026 | All rights reserved | Powered by Vidhya Vikas
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
