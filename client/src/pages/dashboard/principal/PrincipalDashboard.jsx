import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  MdPeople, MdQuiz, MdReport, MdFeedback, MdCheckCircle,
  MdClose, MdArrowForward, MdBarChart, MdNotifications,
  MdGavel, MdStar, MdCalendarToday,
} from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext';
import { staggerContainer, staggerItem } from '../../../animations/stagger';
import { fadeInUp } from '../../../animations/fadeIn';

const deptAttendance = [
  { dept: 'CSE', pct: 88 }, { dept: 'ECE', pct: 82 }, { dept: 'MECH', pct: 79 },
  { dept: 'CIVIL', pct: 85 }, { dept: 'MBA', pct: 91 }, { dept: 'MCA', pct: 86 },
];

const pendingQuestions = [
  { id: 1, teacher: 'Prof. Ramesh', subject: 'Data Structures', class: 'CSE-4A', submitted: '2024-06-18', total: 20 },
  { id: 2, teacher: 'Dr. Priya', subject: 'Thermodynamics', class: 'MECH-3B', submitted: '2024-06-17', total: 15 },
  { id: 3, teacher: 'Prof. Anand', subject: 'DBMS', class: 'CSE-3A', submitted: '2024-06-19', total: 18 },
];

const recentComplaints = [
  { id: 1, title: 'Lab equipment broken', category: 'infrastructure', priority: 'high', status: 'open', from: 'STU041' },
  { id: 2, title: 'Bus route timing issue', category: 'transport', priority: 'medium', status: 'in_progress', from: 'STU078' },
  { id: 3, title: 'Canteen food quality', category: 'other', priority: 'low', status: 'open', from: 'STU022' },
];

const feedbackRatings = [
  { facility: 'Canteen', rating: 3.8 }, { facility: 'Library', rating: 4.5 },
  { facility: 'Hostel', rating: 3.2 }, { facility: 'Transport', rating: 3.9 },
  { facility: 'Labs', rating: 4.7 },
];

const priorityColors = { high: 'bg-red-500/20 text-red-400', medium: 'bg-amber-500/20 text-amber-400', low: 'bg-green-500/20 text-green-400' };
const statusColors = { open: 'bg-red-500/20 text-red-400', in_progress: 'bg-blue-500/20 text-blue-400', resolved: 'bg-green-500/20 text-green-400' };

const Tooltip_ = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-xl text-sm">
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      {payload.map(p => <p key={p.name} className="text-slate-900 font-semibold" style={{ color: p.color }}>{p.value}</p>)}
    </div>
  );
  return null;
};

const PrincipalDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [approving, setApproving] = useState(null);
  const [comment, setComment] = useState('');

  const stats = [
    { label: 'Total Students', value: '1,247', icon: MdPeople, color: 'from-primary-500 to-indigo-600', sub: '+12 this month' },
    { label: 'Total Staff', value: '89', icon: MdPeople, color: 'from-violet-500 to-purple-600', sub: '12 departments' },
    { label: 'Pending Approvals', value: pendingQuestions.length, icon: MdQuiz, color: 'from-amber-500 to-orange-600', sub: 'Question papers' },
    { label: 'Open Complaints', value: recentComplaints.filter(c => c.status === 'open').length, icon: MdReport, color: 'from-red-500 to-rose-600', sub: 'Need attention' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate"
        className="relative rounded-3xl p-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3b0764 0%, #4c1d95 50%, #1e1b4b 100%)', border: '1px solid rgba(139,92,246,0.3)' }}>
        <div className="absolute w-64 h-64 rounded-full bg-violet-500/10 blur-3xl -top-10 right-20" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-violet-300 text-sm font-medium">Principal's Office 🎓</p>
            <h1 className="text-slate-900 text-2xl font-bold mt-1">{user?.name}</h1>
            <p className="text-slate-700 text-sm mt-1">Principal · {user?.loginId} · Administration</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-900 text-xs">AY 2024-25</span>
              <span className="px-3 py-1 bg-violet-500/20 border border-violet-500/30 rounded-lg text-violet-300 text-xs">3 Pending Approvals</span>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-2xl">
              <span className="text-slate-900 text-2xl font-black">{user?.name?.charAt(0)}</span>
            </div>
            <span className="text-violet-300 text-xs font-medium">Principal</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <motion.div key={s.label} variants={staggerItem} whileHover={{ y: -4 }}
            className="rounded-2xl p-5 border border-slate-200 relative overflow-hidden" style={{ background: 'rgba(255,255,255,1)' }}>
            <div className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-10 bg-gradient-to-br ${s.color}`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{s.label}</p>
                <p className="text-slate-900 text-3xl font-bold mt-1">{s.value}</p>
                <p className="text-slate-500 text-xs mt-1">{s.sub}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                <s.icon className="text-slate-900 text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Question Papers */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 rounded-2xl p-5 border border-slate-200" style={{ background: 'rgba(255,255,255,1)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-semibold">Pending Question Papers</h3>
            <button onClick={() => navigate('/academic/question-bank')} className="text-primary-400 text-xs hover:text-primary-300 flex items-center gap-1">
              View All <MdArrowForward />
            </button>
          </div>
          <div className="space-y-3">
            {pendingQuestions.map(qp => (
              <div key={qp.id} className="p-4 rounded-xl bg-white/3 border border-amber-500/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-sm font-medium">{qp.subject}</p>
                    <p className="text-slate-500 text-xs mt-0.5">By {qp.teacher} · {qp.class} · {qp.total} questions</p>
                    <p className="text-slate-600 text-xs mt-1">Submitted {qp.submitted}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setApproving({ ...qp, action: 'approve' })}
                      className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-600/30 flex items-center gap-1">
                      <MdCheckCircle /> Approve
                    </button>
                    <button onClick={() => setApproving({ ...qp, action: 'reject' })}
                      className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-600/30 flex items-center gap-1">
                      <MdClose /> Reject
                    </button>
                  </div>
                </div>
                {approving?.id === qp.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 overflow-hidden">
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder={`Add comment for ${approving.action}...`}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-sm placeholder-slate-600 resize-none outline-none focus:border-primary-500/50 mb-2"
                    />
                    <div className="flex gap-2">
                      <button className={`px-3 py-1.5 rounded-lg text-xs font-medium text-slate-900 ${approving.action === 'approve' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>
                        Confirm {approving.action === 'approve' ? 'Approval' : 'Rejection'}
                      </button>
                      <button onClick={() => { setApproving(null); setComment(''); }} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs hover:bg-slate-100">Cancel</button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feedback Ratings */}
        <motion.div variants={fadeInUp} className="rounded-2xl p-5 border border-slate-200" style={{ background: 'rgba(255,255,255,1)' }}>
          <h3 className="text-slate-900 font-semibold mb-4">Facility Ratings</h3>
          <div className="space-y-3">
            {feedbackRatings.map(f => (
              <div key={f.facility}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">{f.facility}</span>
                  <div className="flex items-center gap-1">
                    <MdStar className="text-amber-400" />
                    <span className="text-slate-900 font-bold">{f.rating}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(f.rating / 5) * 100}%` }}
                    transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/feedback')} className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs rounded-xl transition-colors flex items-center justify-center gap-1">
            Full Analytics <MdArrowForward />
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dept Attendance Chart */}
        <motion.div variants={fadeInUp} className="rounded-2xl p-5 border border-slate-200" style={{ background: 'rgba(255,255,255,1)' }}>
          <h3 className="text-slate-900 font-semibold mb-4">Department-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptAttendance} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tooltip_ />} />
              <Bar dataKey="pct" name="Attendance %" radius={[6, 6, 0, 0]}>
                {deptAttendance.map((e, i) => (
                  <Cell key={i} fill={e.pct < 80 ? '#ef4444' : e.pct < 85 ? '#f59e0b' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Complaints */}
        <motion.div variants={fadeInUp} className="rounded-2xl p-5 border border-slate-200" style={{ background: 'rgba(255,255,255,1)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-semibold">Recent Complaints</h3>
            <button onClick={() => navigate('/core')} className="text-primary-400 text-xs hover:text-primary-300 flex items-center gap-1">View all <MdArrowForward /></button>
          </div>
          <div className="space-y-3">
            {recentComplaints.map(c => (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MdGavel className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm font-medium truncate">{c.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{c.from} · {c.category}</p>
                </div>
                <div className="flex flex-col gap-1 items-end flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[c.priority]}`}>{c.priority}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[c.status]}`}>{c.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
