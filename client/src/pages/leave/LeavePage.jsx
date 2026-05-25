import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdAdd, MdCheckCircle, MdCancel, MdAccessTime } from 'react-icons/md';
import { fadeInUp } from '../../animations/fadeIn';
import { staggerContainer, staggerItem } from '../../animations/stagger';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const mockLeaves = [
  { id: 1, name: 'Alice Johnson', loginId: 'STU001', type: 'sick', from: '2024-06-20', to: '2024-06-21', days: 2, reason: 'Fever and cold', status: 'pending' },
  { id: 2, name: 'Bob Smith', loginId: 'TCH001', type: 'casual', from: '2024-06-25', to: '2024-06-25', days: 1, reason: 'Personal work', status: 'approved' },
  { id: 3, name: 'Alice Johnson', loginId: 'STU001', type: 'study', from: '2024-05-10', to: '2024-05-12', days: 3, reason: 'Exam preparation', status: 'approved' },
];

const leaveTypes = ['sick', 'casual', 'emergency', 'study'];
const statusConfig = {
  pending:  { label: 'Pending',  color: 'bg-amber-500/20 text-amber-400',  icon: MdAccessTime },
  approved: { label: 'Approved', color: 'bg-green-500/20 text-green-400',  icon: MdCheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400',      icon: MdCancel },
};

const LeavePage = () => {
  const { user } = useAuth();
  const isAdmin = ['admin', 'principal', 'coordinator'].includes(user?.role);
  const [leaves, setLeaves] = useState(mockLeaves);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: 'sick', from: '', to: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  const myLeaves = isAdmin ? leaves : leaves.filter(l => l.loginId === user?.loginId);

  const handleApply = async e => {
    e.preventDefault();
    if (!form.from || !form.to || !form.reason) { toast.error('Please fill all fields'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    const days = Math.ceil((new Date(form.to) - new Date(form.from)) / 86400000) + 1;
    setLeaves(prev => [{ id: Date.now(), name: user.name, loginId: user.loginId, ...form, days, status: 'pending' }, ...prev]);
    setShowModal(false);
    setForm({ type: 'sick', from: '', to: '', reason: '' });
    toast.success('Leave application submitted!');
    setSubmitting(false);
  };

  const updateStatus = (id, status) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    toast.success(`Leave ${status}!`);
  };

  return (
    <div className="space-y-6">
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Leave Management</h1>
          <p className="text-slate-400 text-sm mt-1">{isAdmin ? 'Review and manage leave requests' : 'Apply and track your leave applications'}</p>
        </div>
        {!isAdmin && (
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors">
            <MdAdd /> Apply for Leave
          </button>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[['Total', myLeaves.length, 'text-white'], ['Approved', myLeaves.filter(l=>l.status==='approved').length, 'text-green-400'], ['Pending', myLeaves.filter(l=>l.status==='pending').length, 'text-amber-400']].map(([l,v,c]) => (
          <div key={l} className="rounded-xl p-4 border border-white/5" style={{background:'rgba(30,41,59,0.8)'}}>
            <p className="text-slate-400 text-xs">{l}</p>
            <p className={`text-2xl font-bold mt-1 ${c}`}>{v}</p>
          </div>
        ))}
      </div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="rounded-2xl border border-white/5 overflow-hidden" style={{background:'rgba(30,41,59,0.8)'}}>
        <div className="p-5 border-b border-white/5">
          <h3 className="text-white font-semibold">{isAdmin ? 'All Leave Requests' : 'My Leave History'}</h3>
        </div>
        <div className="divide-y divide-white/5">
          {myLeaves.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">No leave applications found.</div>}
          {myLeaves.map(l => {
            const S = statusConfig[l.status];
            return (
              <motion.div key={l.id} variants={staggerItem} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${S.color}`}>
                  <S.icon className="text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  {isAdmin && <p className="text-white text-sm font-medium">{l.name} <span className="text-slate-500 font-mono text-xs">({l.loginId})</span></p>}
                  <p className={`text-sm ${isAdmin ? 'text-slate-400' : 'text-white font-medium'}`}>
                    {l.type.charAt(0).toUpperCase() + l.type.slice(1)} Leave · {l.days} day{l.days > 1 ? 's' : ''}
                  </p>
                  <p className="text-slate-500 text-xs">{l.from} → {l.to} · {l.reason}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${S.color}`}>{S.label}</span>
                  {isAdmin && l.status === 'pending' && (
                    <div className="flex gap-1">
                      <button onClick={() => updateStatus(l.id, 'approved')} className="px-2 py-1 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30 transition-colors">Approve</button>
                      <button onClick={() => updateStatus(l.id, 'rejected')} className="px-2 py-1 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30 transition-colors">Reject</button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="w-full max-w-md rounded-3xl p-6 border border-white/10"
              style={{ background: 'rgba(15,23,42,0.98)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-lg font-bold">Apply for Leave</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><MdClose className="text-xl" /></button>
              </div>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Leave Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {leaveTypes.map(t => (
                      <label key={t} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-sm ${form.type === t ? 'border-primary-500 bg-primary-500/10 text-primary-400' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
                        <input type="radio" name="type" value={t} className="sr-only" onChange={() => setForm(p => ({ ...p, type: t }))} />
                        <span className="capitalize">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">From Date</label>
                    <input type="date" value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-primary-500/50" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">To Date</label>
                    <input type="date" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-primary-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Reason</label>
                  <textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} rows={3} placeholder="Reason for leave..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 resize-none outline-none focus:border-primary-500/50" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : 'Submit Application'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeavePage;
