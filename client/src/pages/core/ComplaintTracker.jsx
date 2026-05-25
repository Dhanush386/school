import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdReport, MdClose, MdArrowForward, MdCheckCircle,
  MdHourglassEmpty, MdChat, MdAttachFile, MdAdd,
} from 'react-icons/md';
import { fadeInUp } from '../../animations/fadeIn';
import { staggerContainer, staggerItem } from '../../animations/stagger';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const mockComplaints = [
  { id: 1, title: 'Lab PC not working', category: 'infrastructure', priority: 'high', status: 'resolved', date: '2024-06-10', description: 'Computer in Lab 2, Row 3 is not starting.', reply: 'Issue resolved — PC replaced on June 12.', resolvedAt: '2024-06-12' },
  { id: 2, title: 'Wi-Fi speed very slow', category: 'infrastructure', priority: 'medium', status: 'in_progress', date: '2024-06-15', description: 'Hostel Block-B Wi-Fi drops frequently after 9 PM.', reply: 'ISP has been contacted. Work in progress.', resolvedAt: null },
];

const categories = ['academic', 'infrastructure', 'hostel', 'transport', 'other'];
const priorities = ['low', 'medium', 'high'];

const statusConfig = {
  open: { label: 'Open', color: 'bg-red-500/20 text-red-400', icon: MdReport },
  in_progress: { label: 'In Progress', color: 'bg-blue-500/20 text-blue-400', icon: MdHourglassEmpty },
  resolved: { label: 'Resolved', color: 'bg-green-500/20 text-green-400', icon: MdCheckCircle },
  closed: { label: 'Closed', color: 'bg-slate-500/20 text-slate-400', icon: MdClose },
};
const priorityColors = { high: 'bg-red-500/20 text-red-400', medium: 'bg-amber-500/20 text-amber-400', low: 'bg-green-500/20 text-green-400' };

const ComplaintTracker = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState(mockComplaints);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'infrastructure', priority: 'medium', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [reply, setReply] = useState('');

  const isAdmin = user?.role === 'admin' || user?.role === 'principal' || user?.role === 'coordinator';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error('Please fill all fields.'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    const newComplaint = { id: Date.now(), ...form, status: 'open', date: new Date().toISOString().split('T')[0], reply: null, resolvedAt: null };
    setComplaints(prev => [newComplaint, ...prev]);
    setShowForm(false);
    setForm({ title: '', category: 'infrastructure', priority: 'medium', description: '' });
    toast.success('Complaint submitted successfully!');
    setSubmitting(false);
  };

  const handleReply = (id) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, reply, status: 'in_progress' } : c));
    setSelected(prev => ({ ...prev, reply, status: 'in_progress' }));
    setReply('');
    toast.success('Reply sent!');
  };

  const handleResolve = (id) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved', resolvedAt: new Date().toISOString().split('T')[0] } : c));
    setSelected(prev => ({ ...prev, status: 'resolved' }));
    toast.success('Complaint marked as resolved!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Grievances & Complaints</h1>
          <p className="text-slate-400 text-sm mt-1">{isAdmin ? 'Manage and respond to student complaints' : 'Submit and track your complaints'}</p>
        </div>
        {!isAdmin && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors">
            <MdAdd /> New Complaint
          </button>
        )}
      </motion.div>

      {/* Stats Row (admin) */}
      {isAdmin && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const count = complaints.filter(c => c.status === key).length;
            return (
              <div key={key} className={`rounded-xl p-4 border border-white/5 ${cfg.color.split(' ')[0]}/10`} style={{ background: 'rgba(30,41,59,0.8)' }}>
                <p className="text-slate-400 text-xs">{cfg.label}</p>
                <p className={`text-2xl font-bold mt-1 ${cfg.color.split(' ')[1]}`}>{count}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Complaints List */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
        {complaints.map(c => {
          const S = statusConfig[c.status] || statusConfig.open;
          return (
            <motion.div key={c.id} variants={staggerItem}
              className="rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
              style={{ background: 'rgba(30,41,59,0.8)' }}
              onClick={() => setSelected(c)}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${S.color}`}>
                  <S.icon className="text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white text-sm font-semibold truncate">{c.title}</p>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[c.priority]}`}>{c.priority}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${S.color}`}>{S.label}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-1 truncate">{c.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-slate-600">
                    <span>{c.category}</span>
                    <span>·</span>
                    <span>Submitted {c.date}</span>
                    {c.reply && <><span>·</span><span className="text-primary-400 flex items-center gap-1"><MdChat />Has reply</span></>}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{ background: 'rgba(15,23,42,0.98)' }}
              onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{selected.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[selected.status]?.color}`}>{statusConfig[selected.status]?.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[selected.priority]}`}>{selected.priority}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{selected.category}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white flex-shrink-0"><MdClose className="text-xl" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Description</p>
                  <p className="text-slate-200 text-sm leading-relaxed">{selected.description}</p>
                </div>
                {selected.reply && (
                  <div className="p-4 rounded-xl bg-primary-900/30 border border-primary-500/20">
                    <p className="text-primary-400 text-xs font-medium mb-2">Admin Reply:</p>
                    <p className="text-slate-200 text-sm">{selected.reply}</p>
                  </div>
                )}
                {isAdmin && selected.status !== 'resolved' && (
                  <div className="space-y-3">
                    <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} placeholder="Type your reply..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 resize-none outline-none focus:border-primary-500/50" />
                    <div className="flex gap-2">
                      <button onClick={() => handleReply(selected.id)} disabled={!reply.trim()}
                        className="flex-1 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
                        Send Reply
                      </button>
                      <button onClick={() => handleResolve(selected.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1">
                        <MdCheckCircle /> Resolve
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Complaint Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="w-full max-w-md rounded-3xl p-6 border border-white/10"
              style={{ background: 'rgba(15,23,42,0.98)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-lg font-bold">New Complaint</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><MdClose className="text-xl" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Title', field: 'title', type: 'text', placeholder: 'Brief description of the issue' },
                ].map(f => (
                  <div key={f.field}>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">{f.label}</label>
                    <input type={f.type} value={form[f.field]} onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none focus:border-primary-500/50" />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-primary-500/50">
                      {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Priority</label>
                    <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-primary-500/50">
                      {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Detailed Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4}
                    placeholder="Describe the issue in detail..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 resize-none outline-none focus:border-primary-500/50" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : 'Submit Complaint'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComplaintTracker;
