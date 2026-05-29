import { motion } from 'framer-motion';
import { MdHotel, MdCheckCircle, MdClose, MdAccessTime } from 'react-icons/md';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const HostelApplication = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [form, setForm] = useState({ roomType: 'double', preferredBlock: 'A', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!form.reason.trim()) { toast.error('Please provide a reason.'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setApplication({ ...form, status: 'pending', appliedAt: new Date().toISOString().split('T')[0] });
    setSubmitting(false);
    toast.success('Hostel application submitted!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-slate-900 text-2xl font-bold">Hostel Management</h1>
        <p className="text-slate-500 text-sm mt-1">Apply for hostel accommodation and manage your stay</p>
      </motion.div>

      {application ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-6 border border-primary-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <MdAccessTime className="text-amber-500 text-xl" />
            </div>
            <div>
              <h3 className="text-slate-900 font-semibold">Application Submitted</h3>
              <p className="text-slate-500 text-xs">Applied on {application.appliedAt}</p>
            </div>
            <span className="ml-auto px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-xs font-medium">Pending Review</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[['Room Type', application.roomType], ['Preferred Block', `Block ${application.preferredBlock}`], ['Status', 'Under Review']].map(([l, v]) => (
              <div key={l} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <p className="text-slate-500 text-xs">{l}</p>
                <p className="text-slate-900 text-sm font-semibold mt-1 capitalize">{v}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-sm mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">Reason: {application.reason}</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <MdHotel className="text-primary-600 text-xl" />
            </div>
            <h3 className="text-slate-900 font-semibold">Apply for Hostel</h3>
          </div>
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-wider font-medium block mb-2">Room Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['single', 'double', 'triple'].map(type => (
                  <label key={type} className={`flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all ${form.roomType === type ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}>
                    <input type="radio" name="roomType" value={type} className="sr-only" onChange={e => setForm(p => ({ ...p, roomType: e.target.value }))} />
                    <span className="text-2xl mb-1">{type === 'single' ? '🛏' : type === 'double' ? '🛏🛏' : '🛏🛏🛏'}</span>
                    <span className="text-xs font-medium capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-wider font-medium block mb-2">Preferred Block</label>
              <select value={form.preferredBlock} onChange={e => setForm(p => ({ ...p, preferredBlock: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
                {['A', 'B', 'C', 'D'].map(b => <option key={b} value={b}>Block {b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-wider font-medium block mb-2">Reason for Hostel</label>
              <textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} rows={3} placeholder="Why do you need hostel accommodation?"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-400 resize-none outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
              {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : 'Submit Application'}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default HostelApplication;
