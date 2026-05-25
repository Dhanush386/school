import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  MdPeople, MdCalendarToday, MdBarChart, MdEvent, MdCheckCircle,
  MdClose, MdArrowForward, MdFeedback, MdSchedule, MdReport,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { staggerContainer, staggerItem } from '../../../animations/stagger';
import { fadeInUp } from '../../../animations/fadeIn';

const deptWeekAttendance = [
  { dept: 'CSE', Mon: 94, Tue: 88, Wed: 92, Thu: 86, Fri: 78 },
  { dept: 'ECE', Mon: 87, Tue: 82, Wed: 85, Thu: 80, Fri: 74 },
  { dept: 'MECH', Mon: 80, Tue: 76, Wed: 79, Thu: 75, Fri: 68 },
];

const leaveRequests = [
  { id: 1, name: 'Prof. Ramesh Kumar', dept: 'CSE', type: 'Sick Leave', from: '2024-06-25', to: '2024-06-27', days: 3, status: 'pending' },
  { id: 2, name: 'Dr. Priya Sharma', dept: 'ECE', type: 'Casual Leave', from: '2024-06-28', to: '2024-06-28', days: 1, status: 'pending' },
  { id: 3, name: 'Mr. Anand Gupta', dept: 'MBA', type: 'Earned Leave', from: '2024-07-01', to: '2024-07-05', days: 5, status: 'approved' },
];

const upcomingEvents = [
  { id: 1, title: 'End Semester Exams Begin', date: 'Jun 28', type: 'exam', color: 'bg-red-500/20 text-red-400' },
  { id: 2, title: 'Staff Meeting — Q3 Review', date: 'Jul 01', type: 'meeting', color: 'bg-blue-500/20 text-blue-400' },
  { id: 3, title: 'National Science Day Event', date: 'Jul 05', type: 'event', color: 'bg-green-500/20 text-green-400' },
  { id: 4, title: 'Timetable Revision Deadline', date: 'Jul 08', type: 'deadline', color: 'bg-amber-500/20 text-amber-400' },
  { id: 5, title: 'Convocation Ceremony', date: 'Jul 15', type: 'ceremony', color: 'bg-purple-500/20 text-purple-400' },
];

const T = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-slate-800 border border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}%</p>)}
    </div>
  );
  return null;
};

const CoordinatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [approvedLeaves, setApprovedLeaves] = useState(new Set());

  const handleApprove = (id) => setApprovedLeaves(prev => new Set([...prev, id]));

  const stats = [
    { label: 'Departments', value: 6, icon: MdPeople, color: 'from-primary-500 to-indigo-600', sub: 'Under management' },
    { label: 'Reports Due', value: 4, icon: MdBarChart, color: 'from-red-500 to-rose-600', sub: 'Staff pending' },
    { label: 'Leave Requests', value: leaveRequests.filter(l => l.status === 'pending').length, icon: MdCalendarToday, color: 'from-amber-500 to-orange-600', sub: 'Awaiting review' },
    { label: 'Events This Week', value: 3, icon: MdEvent, color: 'from-green-500 to-emerald-600', sub: '1 exam, 2 events' },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const colors = ['#6366f1', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate"
        className="relative rounded-3xl p-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #0d9488 100%)', border: '1px solid rgba(20,184,166,0.3)' }}>
        <div className="absolute w-64 h-64 rounded-full bg-teal-500/10 blur-3xl top-0 right-0" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-teal-300 text-sm font-medium">Academic Coordinator 📋</p>
            <h1 className="text-white text-2xl font-bold mt-1">{user?.name}</h1>
            <p className="text-slate-300 text-sm mt-1">Coordinator · {user?.loginId} · Academic Affairs</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 bg-white/10 rounded-lg text-white text-xs">AY 2024-25</span>
              <span className="px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-lg text-teal-300 text-xs">6 Departments Managed</span>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-2xl">
              <span className="text-white text-2xl font-black">{user?.name?.charAt(0)}</span>
            </div>
            <span className="text-teal-300 text-xs font-medium">Coordinator</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <motion.div key={s.label} variants={staggerItem} whileHover={{ y: -4 }}
            className="rounded-2xl p-5 border border-white/5 relative overflow-hidden" style={{ background: 'rgba(30,41,59,0.8)' }}>
            <div className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-10 bg-gradient-to-br ${s.color}`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{s.label}</p>
                <p className="text-white text-3xl font-bold mt-1">{s.value}</p>
                <p className="text-slate-500 text-xs mt-1">{s.sub}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                <s.icon className="text-white text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dept Attendance Chart */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 rounded-2xl p-5 border border-white/5" style={{ background: 'rgba(30,41,59,0.8)' }}>
          <h3 className="text-white font-semibold mb-4">This Week's Department Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={days.map(d => ({ day: d, ...Object.fromEntries(deptWeekAttendance.map(dep => [dep.dept, dep[d]])) }))} barGap={2} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<T />} />
              {deptWeekAttendance.map((dep, i) => (
                <Bar key={dep.dept} dataKey={dep.dept} fill={colors[i]} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {deptWeekAttendance.map((dep, i) => (
              <div key={dep.dept} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: colors[i] }} />
                <span className="text-slate-400 text-xs">{dep.dept}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={fadeInUp} className="rounded-2xl p-5 border border-white/5" style={{ background: 'rgba(30,41,59,0.8)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Upcoming Events</h3>
            <button className="text-primary-400 text-xs hover:text-primary-300 flex items-center gap-1">View <MdArrowForward /></button>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map(e => (
              <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <div className={`px-2 py-1 rounded-lg text-center min-w-[40px] flex-shrink-0 ${e.color}`}>
                  <p className="text-xs font-bold leading-tight">{e.date.split(' ')[0]}</p>
                  <p className="text-xs opacity-75 leading-tight">{e.date.split(' ')[1]}</p>
                </div>
                <p className="text-slate-300 text-xs font-medium flex-1 min-w-0 truncate">{e.title}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Staff Leave Requests */}
      <motion.div variants={fadeInUp} className="rounded-2xl p-5 border border-white/5" style={{ background: 'rgba(30,41,59,0.8)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Staff Leave Requests</h3>
          <span className="text-slate-400 text-xs">{leaveRequests.filter(l => l.status === 'pending').length} pending</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Staff Member', 'Department', 'Leave Type', 'Period', 'Days', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left text-slate-500 text-xs font-medium pb-3 pr-4 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaveRequests.map(l => (
                <tr key={l.id} className="hover:bg-white/3 transition-colors">
                  <td className="py-3 pr-4 text-white text-xs font-medium whitespace-nowrap">{l.name}</td>
                  <td className="py-3 pr-4 text-slate-400 text-xs">{l.dept}</td>
                  <td className="py-3 pr-4 text-slate-400 text-xs whitespace-nowrap">{l.type}</td>
                  <td className="py-3 pr-4 text-slate-400 text-xs whitespace-nowrap">{l.from} → {l.to}</td>
                  <td className="py-3 pr-4 text-white text-xs font-semibold">{l.days}d</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      approvedLeaves.has(l.id) || l.status === 'approved'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {approvedLeaves.has(l.id) ? 'Approved' : l.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {(l.status === 'pending' && !approvedLeaves.has(l.id)) ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleApprove(l.id)}
                          className="p-1.5 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors">
                          <MdCheckCircle className="text-sm" />
                        </button>
                        <button className="p-1.5 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors">
                          <MdClose className="text-sm" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default CoordinatorDashboard;
