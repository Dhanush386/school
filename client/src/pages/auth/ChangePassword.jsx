import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdLock, MdVisibility, MdVisibilityOff, MdCheckCircle, MdSchool } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Contains number', pass: /[0-9]/.test(password) },
    { label: 'Contains special character', pass: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-white/10'}`}
          />
        ))}
      </div>
      {password && (
        <p className={`text-xs font-medium ${score === 4 ? 'text-green-400' : score >= 2 ? 'text-amber-400' : 'text-red-400'}`}>
          {labels[score - 1] || 'Weak'}
        </p>
      )}
      <div className="grid grid-cols-2 gap-1 mt-2">
        {checks.map(check => (
          <div key={check.label} className={`flex items-center gap-1.5 text-xs ${check.pass ? 'text-green-400' : 'text-slate-500'}`}>
            <MdCheckCircle className={`flex-shrink-0 ${check.pass ? 'text-green-400' : 'text-slate-600'}`} />
            {check.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const InputField = ({ label, field, showKey, placeholder, form, handleChange, show, setShow }) => (
  <div>
    <label className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-2">{label}</label>
    <div className="relative">
      <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
      <input
        type={show[showKey] ? 'text' : 'password'}
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-500/60 transition-all"
      />
      <button
        type="button"
        onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
      >
        {show[showKey] ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
      </button>
    </div>
  </div>
);

const ChangePassword = () => {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.newPassword)) {
      toast.error('Password must contain uppercase, lowercase, and a number.');
      return;
    }
    if (form.newPassword === form.oldPassword) {
      toast.error('New password must be different from current password.');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword(form.oldPassword, form.newPassword);
      toast.success('Password changed successfully!');
      updateUser({ mustChangePassword: false });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMsg = err?.response?.data?.errors?.[0] || err?.response?.data?.message || 'Failed to change password.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-primary-600/15 rounded-full blur-3xl -top-20 -right-20" />
        <div className="absolute w-64 h-64 bg-violet-600/15 rounded-full blur-3xl bottom-20 -left-10" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="rounded-3xl p-8 border"
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(40px)',
              borderColor: 'rgba(99,102,241,0.2)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <MdLock className="text-white text-3xl" />
              </div>
              <h1 className="text-xl font-bold text-white">Set New Password</h1>
              <p className="text-slate-400 text-sm mt-1">
                Welcome, <span className="text-primary-400 font-semibold">{user?.name}</span>!
                Please create a secure password to continue.
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-amber-400 text-xs bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                <span>⚠</span>
                First login — password change required
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField label="Current Password" field="oldPassword" showKey="old" placeholder="Your current password" form={form} handleChange={handleChange} show={show} setShow={setShow} />
              <div>
                <InputField label="New Password" field="newPassword" showKey="new" placeholder="Create a strong password" form={form} handleChange={handleChange} show={show} setShow={setShow} />
                <PasswordStrength password={form.newPassword} />
              </div>
              <InputField label="Confirm New Password" field="confirmPassword" showKey="confirm" placeholder="Re-enter new password" form={form} handleChange={handleChange} show={show} setShow={setShow} />

              {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <span>⚠</span> Passwords do not match
                </p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm
                  bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500
                  disabled:opacity-60 shadow-lg shadow-primary-900/40 transition-all mt-6"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                  </>
                ) : 'Update Password & Continue'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePassword;
