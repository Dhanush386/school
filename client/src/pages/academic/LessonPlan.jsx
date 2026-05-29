import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdBook, MdClose, MdAdd, MdCheckCircle, MdSchedule, MdCancel } from 'react-icons/md';
import { fadeInUp } from '../../animations/fadeIn';
import { staggerContainer, staggerItem } from '../../animations/stagger';
import toast from 'react-hot-toast';

const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Sci'];
const classes = ['10-A', '10-B', '12-A'];

const mockPlans = [
  { id: 1, subject: 'Mathematics', class: '10-A', topic: 'Quadratic Equations', outcomes: 'Students will solve quadratic equations using formulas', date: '2024-06-18', status: 'completed' },
  { id: 2, subject: 'Science', class: '10-A', topic: 'Laws of Motion', outcomes: 'Students understand Newton\'s 3 laws of motion', date: '2024-06-19', status: 'completed' },
  { id: 3, subject: 'English', class: '10-B', topic: 'Creative Writing Workshop', outcomes: 'Students will write short narrative essays', date: '2024-06-20', status: 'planned' },
  { id: 4, subject: 'History', class: '12-A', topic: 'World War II Causes', outcomes: 'Students understand primary geopolitical triggers', date: '2024-06-21', status: 'planned' },
  { id: 5, subject: 'Computer Sci', class: '10-A', topic: 'Intro to Python', outcomes: 'Students can write basic print statements and loops', date: '2024-06-22', status: 'cancelled' },
];

const statusConfig = {
  planned:   { label: 'Planned',   color: 'bg-blue-500/20 text-blue-400',   icon: MdSchedule },
  completed: { label: 'Completed', color: 'bg-green-500/20 text-green-400', icon: MdCheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400',     icon: MdCancel },
};

const LessonPlan = () => {
  const [plans, setPlans] = useState(mockPlans);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject: subjects[0], class: classes[0], topic: '', date: '', outcomes: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async e => {
    e.preventDefault();
    if (!form.topic || !form.date) { toast.error('Please fill all required fields'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setPlans(prev => [{ id: Date.now(), ...form, status: 'planned' }, ...prev]);
    setShowModal(false);
    setForm({ subject: subjects[0], class: classes[0], topic: '', date: '', outcomes: '' });
    toast.success('Lesson plan added!');
    setSubmitting(false);
  };

  const toggleStatus = id => {
    setPlans(prev => prev.map(p => {
      if (p.id !== id) return p;
      const next = { planned: 'completed', completed: 'cancelled', cancelled: 'planned' };
      return { ...p, status: next[p.status] };
    }));
  };

  return (
    <div className="space-y-6">
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-start justify-between">
        <div>
          <h1 className="text-slate-900 text-2xl font-bold">Lesson Plans</h1>
          <p className="text-slate-500 text-sm mt-1">Plan and track your teaching schedule</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-slate-900 rounded-xl text-sm font-medium transition-colors">
          <MdAdd /> Add Lesson Plan
        </button>
      </motion.div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
        {plans.map(plan => {
          const S = statusConfig[plan.status];
          return (
            <motion.div key={plan.id} variants={staggerItem}
              className="rounded-2xl p-4 border border-slate-200 hover:border-slate-200 transition-all"
              style={{ background: 'rgba(255,255,255,1)' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <MdBook className="text-primary-400 text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-slate-900 text-sm font-semibold">{plan.topic}</p>
                    <button onClick={() => toggleStatus(plan.id)}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 cursor-pointer transition-opacity hover:opacity-70 ${S.color}`}>
                      {S.label}
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">{plan.subject} · {plan.class} · {plan.date}</p>
                  <p className="text-slate-500 text-xs mt-1 italic">{plan.outcomes}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="w-full max-w-md rounded-3xl p-6 border border-slate-200 overflow-y-auto max-h-[90vh]"
              style={{ background: 'rgba(15,23,42,0.98)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-slate-900 text-lg font-bold">Add Lesson Plan</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-900"><MdClose className="text-xl" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 text-xs uppercase tracking-wider block mb-2">Subject</label>
                    <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-sm outline-none focus:border-primary-500/50">
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs uppercase tracking-wider block mb-2">Class</label>
                    <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-sm outline-none focus:border-primary-500/50">
                      {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 text-xs uppercase tracking-wider block mb-2">Topic *</label>
                  <input type="text" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} placeholder="e.g. Binary Search Trees"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-600 outline-none focus:border-primary-500/50" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs uppercase tracking-wider block mb-2">Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:border-primary-500/50" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs uppercase tracking-wider block mb-2">Learning Outcomes</label>
                  <textarea value={form.outcomes} onChange={e => setForm(p => ({ ...p, outcomes: e.target.value }))} rows={3} placeholder="What students will learn..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-600 resize-none outline-none focus:border-primary-500/50" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-slate-900 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : 'Add Lesson Plan'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonPlan;
