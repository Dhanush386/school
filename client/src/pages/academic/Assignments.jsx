import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAssignment, MdClose, MdUpload, MdCheckCircle, MdAccessTime, MdGrade, MdAdd } from 'react-icons/md';
import { fadeInUp } from '../../animations/fadeIn';
import { staggerContainer, staggerItem } from '../../animations/stagger';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const mockAssignments = [
  { id: 1, title: 'Data Structures Lab Report', subject: 'Data Structures', dueDate: '2024-06-20', status: 'submitted', submittedAt: '2024-06-18', grade: 'A', feedback: 'Excellent work! Well structured report.', teacher: 'Bob Smith' },
  { id: 2, title: 'Algorithm Analysis Essay', subject: 'Algorithm Design', dueDate: '2024-06-25', status: 'pending', submittedAt: null, grade: null, feedback: null, teacher: 'Bob Smith' },
  { id: 3, title: 'Database Schema Design', subject: 'Database Lab', dueDate: '2024-06-15', status: 'overdue', submittedAt: null, grade: null, feedback: null, teacher: 'Bob Smith' },
  { id: 4, title: 'OS Process Scheduling Report', subject: 'OS Concepts', dueDate: '2024-06-30', status: 'pending', submittedAt: null, grade: null, feedback: null, teacher: 'Bob Smith' },
];

const statusConfig = {
  submitted: { label: 'Submitted', color: 'bg-green-500/20 text-green-400', icon: MdCheckCircle },
  pending:   { label: 'Pending',   color: 'bg-amber-500/20 text-amber-400', icon: MdAccessTime },
  overdue:   { label: 'Overdue',   color: 'bg-red-500/20 text-red-400',     icon: MdClose },
  graded:    { label: 'Graded',    color: 'bg-blue-500/20 text-blue-400',   icon: MdGrade },
};

const Assignments = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const [assignments, setAssignments] = useState(mockAssignments);
  const [selected, setSelected] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setAssignments(prev => prev.map(a => a.id === selected.id ? { ...a, status: 'submitted', submittedAt: new Date().toISOString().split('T')[0] } : a));
    setShowSubmit(false);
    setFileName('');
    toast.success('Assignment submitted successfully!');
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Homework</h1>
          <p className="text-slate-400 text-sm mt-1">{isTeacher ? 'Manage and review student homework' : 'Your homework and submissions'}</p>
        </div>
        {isTeacher && (
          <button onClick={() => toast('Assignment creation coming soon!', { icon: '📋' })}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors">
            <MdAdd /> Create Assignment
          </button>
        )}
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[['Total', assignments.length, 'text-white'], ['Submitted', assignments.filter(a=>a.status==='submitted').length, 'text-green-400'],
          ['Pending', assignments.filter(a=>a.status==='pending').length, 'text-amber-400'],
          ['Overdue', assignments.filter(a=>a.status==='overdue').length, 'text-red-400']].map(([l,v,c]) => (
          <div key={l} className="rounded-xl p-4 border border-white/5" style={{background:'rgba(30,41,59,0.8)'}}>
            <p className="text-slate-400 text-xs">{l}</p>
            <p className={`text-2xl font-bold mt-1 ${c}`}>{v}</p>
          </div>
        ))}
      </div>

      {/* Assignment list */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
        {assignments.map(a => {
          const S = statusConfig[a.status] || statusConfig.pending;
          return (
            <motion.div key={a.id} variants={staggerItem}
              className="rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
              style={{background:'rgba(30,41,59,0.8)'}}
              onClick={() => { setSelected(a); }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <MdAssignment className="text-primary-400 text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white text-sm font-semibold">{a.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${S.color}`}>{S.label}</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{a.subject} · Due: {a.dueDate}</p>
                  {a.grade && <p className="text-blue-400 text-xs mt-1 font-medium">Grade: {a.grade} — {a.feedback}</p>}
                </div>
              </div>
              {!isTeacher && a.status !== 'submitted' && a.status !== 'graded' && (
                <button onClick={e => { e.stopPropagation(); setSelected(a); setShowSubmit(true); }}
                  className="mt-3 flex items-center gap-1.5 px-4 py-1.5 bg-primary-600/20 hover:bg-primary-600/40 text-primary-400 rounded-lg text-xs font-medium transition-colors border border-primary-500/20">
                  <MdUpload /> Submit Assignment
                </button>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmit && selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => { setShowSubmit(false); setFileName(''); }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="w-full max-w-md rounded-3xl p-6 border border-white/10"
              style={{ background: 'rgba(15,23,42,0.98)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-lg font-bold">Submit Assignment</h2>
                <button onClick={() => { setShowSubmit(false); setFileName(''); }} className="text-slate-400 hover:text-white"><MdClose className="text-xl" /></button>
              </div>
              <p className="text-slate-400 text-sm mb-6">{selected.title}</p>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFileName(f.name); }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragging ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-white/20'}`}>
                <MdUpload className="text-4xl text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">{fileName || 'Drag & drop your file here'}</p>
                <p className="text-slate-600 text-xs mt-1">or</p>
                <label className="mt-3 inline-block px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm cursor-pointer transition-colors">
                  Browse Files
                  <input type="file" className="hidden" onChange={e => setFileName(e.target.files[0]?.name || '')} />
                </label>
              </div>
              <button onClick={handleSubmit} disabled={submitting}
                className="mt-4 w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : 'Submit Assignment'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Assignments;
