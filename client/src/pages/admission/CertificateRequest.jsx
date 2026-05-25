import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdSchool, MdCheckCircle, MdClose, MdHourglassEmpty, MdDownload } from 'react-icons/md';
import { fadeInUp } from '../../animations/fadeIn';
import { staggerContainer, staggerItem } from '../../animations/stagger';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const certTypes = [
  { type: 'bonafide', label: 'Bonafide Certificate', description: 'Certifies you are a genuine student of this institution.', turnaround: '2-3 working days', icon: '🎓', color: 'from-blue-500 to-cyan-600' },
  { type: 'character', label: 'Character Certificate', description: 'Testifies to your good conduct and character during study.', turnaround: '3-4 working days', icon: '⭐', color: 'from-violet-500 to-purple-600' },
  { type: 'transfer', label: 'Transfer Certificate', description: 'Required for admission to another institution.', turnaround: '5-7 working days', icon: '📋', color: 'from-amber-500 to-orange-600' },
  { type: 'completion', label: 'Course Completion', description: 'Certifies that you have completed your course requirements.', turnaround: '5-7 working days', icon: '🏆', color: 'from-green-500 to-emerald-600' },
  { type: 'migration', label: 'Migration Certificate', description: 'Required when migrating to another university.', turnaround: '7-10 working days', icon: '📦', color: 'from-rose-500 to-pink-600' },
];

const statusConfig = {
  pending: { label: 'Pending Review', color: 'bg-amber-500/20 text-amber-400', icon: MdHourglassEmpty },
  approved: { label: 'Approved', color: 'bg-blue-500/20 text-blue-400', icon: MdCheckCircle },
  ready: { label: 'Ready to Download', color: 'bg-green-500/20 text-green-400', icon: MdDownload },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400', icon: MdClose },
};

const mockRequests = [
  { id: 1, type: 'bonafide', label: 'Bonafide Certificate', purpose: 'Bank account opening', date: '2024-06-10', status: 'ready' },
  { id: 2, type: 'character', label: 'Character Certificate', purpose: 'Job application', date: '2024-06-18', status: 'pending' },
];

const CertificateRequest = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState(mockRequests);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = user?.role === 'admin';

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!purpose.trim()) { toast.error('Please describe the purpose.'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    const ct = certTypes.find(c => c.type === selectedType);
    setRequests(prev => [{ id: Date.now(), type: selectedType, label: ct.label, purpose, date: new Date().toISOString().split('T')[0], status: 'pending' }, ...prev]);
    setShowModal(false);
    setPurpose('');
    toast.success('Certificate request submitted!');
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <h1 className="text-white text-2xl font-bold">Certificate Requests</h1>
        <p className="text-slate-400 text-sm mt-1">Request official certificates from the institution</p>
      </motion.div>

      {/* Certificate Types */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certTypes.map(cert => (
          <motion.div key={cert.type} variants={staggerItem} whileHover={{ y: -4 }}
            className="rounded-2xl p-5 border border-white/5" style={{ background: 'rgba(30,41,59,0.8)' }}>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center text-2xl mb-4`}>
              {cert.icon}
            </div>
            <h3 className="text-white font-semibold text-sm">{cert.label}</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{cert.description}</p>
            <p className="text-slate-500 text-xs mt-2">⏱ {cert.turnaround}</p>
            <button onClick={() => { setSelectedType(cert.type); setShowModal(true); }}
              className={`mt-4 w-full py-2 bg-gradient-to-r ${cert.color} text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity`}>
              Request
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* My Requests */}
      <motion.div variants={fadeInUp} className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: 'rgba(30,41,59,0.8)' }}>
        <div className="p-5 border-b border-white/5">
          <h3 className="text-white font-semibold">{isAdmin ? 'All Requests' : 'My Requests'}</h3>
        </div>
        <div className="divide-y divide-white/5">
          {requests.map(req => {
            const S = statusConfig[req.status];
            return (
              <div key={req.id} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${S.color}`}>
                  <S.icon className="text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{req.label}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{req.purpose} · {req.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${S.color}`}>{S.label}</span>
                  {req.status === 'ready' && (
                    <button onClick={() => toast.success('Downloading certificate...')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30 transition-colors">
                      <MdDownload /> Download
                    </button>
                  )}
                  {isAdmin && req.status === 'pending' && (
                    <div className="flex gap-1">
                      <button onClick={() => { setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'ready' } : r)); toast.success('Approved!'); }}
                        className="px-2 py-1 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30">Approve</button>
                      <button onClick={() => { setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r)); toast.error('Rejected'); }}
                        className="px-2 py-1 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30">Reject</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="w-full max-w-md rounded-3xl p-6 border border-white/10"
            style={{ background: 'rgba(15,23,42,0.98)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-bold">Request Certificate</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><MdClose className="text-xl" /></button>
            </div>
            <div className="mb-4 p-3 bg-white/5 rounded-xl">
              <p className="text-white text-sm font-medium">{certTypes.find(c => c.type === selectedType)?.label}</p>
              <p className="text-slate-400 text-xs mt-0.5">Turnaround: {certTypes.find(c => c.type === selectedType)?.turnaround}</p>
            </div>
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Purpose / Reason</label>
                <textarea value={purpose} onChange={e => setPurpose(e.target.value)} rows={3} placeholder="e.g. Bank account opening, Job application, University admission..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 resize-none outline-none focus:border-primary-500/50" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : 'Submit Request'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CertificateRequest;
