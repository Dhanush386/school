import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdPerson, MdSecurity, MdSave, MdBadge, MdEmail, MdPhone, MdVpnKey } from 'react-icons/md';
import { fadeInUp } from '../../animations/fadeIn';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const roleColors = {
  student:     'from-blue-500 to-indigo-600',
  teacher:     'from-green-500 to-emerald-600',
  principal:   'from-purple-500 to-violet-600',
  admin:       'from-red-500 to-rose-600',
  coordinator: 'from-amber-500 to-orange-600',
};

const strengthLabel = pwd => {
  if (!pwd) return { label: '', color: 'bg-slate-700', width: '0%' };
  if (pwd.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
  if (pwd.length < 10) return { label: 'Fair', color: 'bg-amber-500', width: '55%' };
  if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
  return { label: 'Strong', color: 'bg-green-500', width: '100%' };
};

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [security, setSecurity] = useState({ current: '', newPwd: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const grad = roleColors[user?.role] || 'from-primary-500 to-violet-600';
  const strength = strengthLabel(security.newPwd);

  const saveProfile = async e => {
    e.preventDefault();
    if (!profile.name) { toast.error('Name is required'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    updateUser({ name: profile.name });
    toast.success('Profile updated successfully!');
    setSaving(false);
  };

  const savePassword = async e => {
    e.preventDefault();
    if (!security.current) { toast.error('Enter your current password'); return; }
    if (security.newPwd.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (security.newPwd !== security.confirm) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSecurity({ current: '', newPwd: '', confirm: '' });
    toast.success('Password changed successfully!');
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <h1 className="text-white text-2xl font-bold">Settings & Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account and security preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate"
          className="rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center"
          style={{ background: 'rgba(30,41,59,0.8)' }}>
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4`}>
            {initials}
          </div>
          <p className="text-white text-lg font-bold">{user?.name}</p>
          <p className="text-slate-400 text-sm font-mono mt-1">{user?.loginId}</p>
          <span className={`mt-3 text-xs px-3 py-1 rounded-full font-medium bg-gradient-to-r ${grad} text-white capitalize`}>
            {user?.role}
          </span>
          <div className="w-full mt-5 pt-4 border-t border-white/5 space-y-2 text-left">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MdBadge className="text-primary-400" />
              <span className="text-xs">{user?.department}</span>
            </div>
            {user?.email && (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MdEmail className="text-primary-400" />
                <span className="text-xs">{user.email}</span>
              </div>
            )}
            {user?.lastLogin && (
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Settings panel */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate"
          className="lg:col-span-2 rounded-2xl border border-white/5 overflow-hidden"
          style={{ background: 'rgba(30,41,59,0.8)' }}>
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {[['profile', 'Profile', MdPerson], ['security', 'Security', MdSecurity]].map(([k, l, Icon]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${tab === k ? 'text-primary-400 border-primary-500' : 'text-slate-400 border-transparent hover:text-slate-300'}`}>
                <Icon /> {l}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === 'profile' && (
              <form onSubmit={saveProfile} className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Full Name</label>
                  <div className="relative">
                    <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                    <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-primary-500/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Email Address</label>
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                    <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-600 outline-none focus:border-primary-500/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Phone Number</label>
                  <div className="relative">
                    <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                    <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-600 outline-none focus:border-primary-500/50 transition-colors" />
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-slate-600 text-xs mb-4">Login ID and Role cannot be changed. Contact admin for updates.</p>
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
                    {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><MdSave />Save Changes</>}
                  </button>
                </div>
              </form>
            )}

            {tab === 'security' && (
              <form onSubmit={savePassword} className="space-y-4">
                {[['Current Password', 'current', 'Enter current password'], ['New Password', 'newPwd', 'Minimum 6 characters'], ['Confirm Password', 'confirm', 'Re-enter new password']].map(([label, key, ph]) => (
                  <div key={key}>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">{label}</label>
                    <div className="relative">
                      <MdVpnKey className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                      <input type="password" value={security[key]} onChange={e => setSecurity(p => ({ ...p, [key]: e.target.value }))} placeholder={ph}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-600 outline-none focus:border-primary-500/50 transition-colors" />
                    </div>
                    {key === 'newPwd' && security.newPwd && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500">Strength</span>
                          <span className={`text-xs font-medium ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ width: strength.width }} transition={{ duration: 0.3 }}
                            className={`h-full rounded-full ${strength.color}`} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-2">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
                    {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</> : <><MdSecurity />Update Password</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
