import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  MdSchool, MdAssignment, MdPayment, MdHotel, MdLocalLibrary,
  MdDirectionsBus, MdReport, MdNotifications, MdCalendarToday,
  MdTrendingUp, MdCheckCircle, MdWarning, MdArrowForward,
  MdMenuBook, MdTimelapse, MdStar, MdPerson,
} from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext';
import { staggerContainer, staggerItem } from '../../../animations/stagger';
import { fadeInUp } from '../../../animations/fadeIn';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const attendanceData = [
  { month: 'Jan', present: 22, absent: 2 },
  { month: 'Feb', present: 19, absent: 3 },
  { month: 'Mar', present: 24, absent: 1 },
  { month: 'Apr', present: 21, absent: 2 },
  { month: 'May', present: 20, absent: 3 },
  { month: 'Jun', present: 23, absent: 0 },
];

const subjectAttendance = [
  { name: 'Mathematics', value: 92, color: '#6366f1' },
  { name: 'Physics', value: 78, color: '#8b5cf6' },
  { name: 'Chemistry', value: 85, color: '#06b6d4' },
  { name: 'English', value: 95, color: '#10b981' },
  { name: 'CS', value: 88, color: '#f59e0b' },
];

const gradeData = [
  { subject: 'Math', grade: 88 },
  { subject: 'Physics', grade: 74 },
  { subject: 'Chem', grade: 82 },
  { subject: 'English', grade: 91 },
  { subject: 'CS', grade: 96 },
  { subject: 'PE', grade: 85 },
];

const upcomingAssignments = [
  { id: 1, title: 'Data Structures Lab Report', subject: 'CS', due: '2024-06-28', status: 'pending' },
  { id: 2, title: 'Quantum Mechanics Problem Set', subject: 'Physics', due: '2024-06-30', status: 'submitted' },
  { id: 3, title: 'English Essay: Digital Era', subject: 'English', due: '2024-07-02', status: 'pending' },
];

const recentNotifications = [
  { id: 1, title: 'Fee Payment Reminder', message: 'Semester fee due on June 30', type: 'warning', time: '2h ago' },
  { id: 2, title: 'Assignment Graded', message: 'Math assignment scored 88/100', type: 'success', time: '5h ago' },
  { id: 3, title: 'Library Book Due', message: '"Clean Code" due tomorrow', type: 'info', time: '1d ago' },
];

const quickActions = [
  { label: 'Pay Fees', icon: MdPayment, path: '/fees', color: 'from-green-500 to-emerald-600' },
  { label: 'Library', icon: MdLocalLibrary, path: '/library', color: 'from-blue-500 to-cyan-600' },
  { label: 'Hostel', icon: MdHotel, path: '/hostel', color: 'from-purple-500 to-violet-600' },
  { label: 'Transport', icon: MdDirectionsBus, path: '/transport', color: 'from-amber-500 to-orange-600' },
  { label: 'Complaint', icon: MdReport, path: '/core', color: 'from-red-500 to-rose-600' },
  { label: 'Certificate', icon: MdSchool, path: '/admission/certificate', color: 'from-indigo-500 to-blue-600' },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <motion.div
    variants={staggerItem}
    whileHover={{ y: -4, scale: 1.02 }}
    className="relative rounded-2xl p-5 overflow-hidden border border-slate-200"
    style={{ background: 'rgba(255,255,255,1)' }}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 bg-gradient-to-br ${color}`} />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-slate-900 text-3xl font-bold mt-1">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <MdTrendingUp className={trend < 0 ? 'rotate-180' : ''} />
            {Math.abs(trend)}% from last month
          </div>
        )}
      </div>
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
        <Icon className="text-slate-900 text-xl" />
      </div>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-xl">
        <p className="text-slate-500 text-xs mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} className="text-slate-900 text-sm font-semibold">
            {p.name}: <span style={{ color: p.color }}>{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="relative rounded-3xl p-6 overflow-hidden"
        style={{
          background: 'white',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-64 h-64 rounded-full bg-primary-500/10 blur-3xl -top-10 -right-10" />
          <div className="absolute w-48 h-48 rounded-full bg-violet-500/10 blur-3xl bottom-0 left-20" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-primary-600 text-sm font-bold">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, 👋</p>
            <h1 className="text-slate-900 text-2xl font-bold mt-1">{user?.name}</h1>
            <p className="text-slate-500 text-sm mt-1">{user?.department} · {user?.loginId} · Section A</p>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-900 text-xs">
                <MdCalendarToday className="text-primary-400" />
                AY 2024-25
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-semibold">
                <MdCheckCircle className="text-green-600" />
                Active Student
              </div>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center shadow-2xl">
              <span className="text-slate-900 text-3xl font-black">{user?.name?.charAt(0)}</span>
            </div>
            <div className="text-center">
              <div className="text-slate-900 text-xl font-bold">87.4%</div>
              <div className="text-slate-500 text-xs">Overall Score</div>
            </div>
          </div>
        </div>

        {/* Progress bars */}
        <div className="relative z-10 mt-5 grid grid-cols-3 gap-4">
          {[
            { label: 'Attendance', value: 88, color: '#6366f1' },
            { label: 'Homework', value: 73, color: '#8b5cf6' },
            { label: 'Grade', value: 87, color: '#06b6d4' },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 text-xs">{item.label}</span>
                <span className="text-slate-900 text-xs font-bold">{item.value}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard icon={MdCheckCircle} label="Attendance" value="88%" sub="23/26 days" color="from-primary-500 to-indigo-600" trend={3} />
        <StatCard icon={MdAssignment} label="Homework" value="11/15" sub="4 pending" color="from-violet-500 to-purple-600" trend={-5} />
        <StatCard icon={MdPayment} label="Fees Due" value="₹8,500" sub="Due Jun 30" color="from-amber-500 to-orange-600" />
        <StatCard icon={MdLocalLibrary} label="Books Issued" value="3" sub="1 overdue" color="from-cyan-500 to-blue-600" />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-2 rounded-2xl p-5 border border-slate-200"
          style={{ background: 'rgba(255,255,255,1)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-slate-900 font-semibold">Attendance Overview</h3>
              <p className="text-slate-500 text-xs mt-0.5">Monthly present/absent breakdown</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1.5 outline-none">
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="present" name="Present" stroke="#6366f1" fill="url(#presentGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="absent" name="Absent" stroke="#ef4444" fill="url(#absentGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Notifications */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl p-5 border border-slate-200"
          style={{ background: 'rgba(255,255,255,1)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-semibold">Notifications</h3>
            <span className="text-slate-500 text-xs">Recent</span>
          </div>
          <div className="space-y-3">
            {recentNotifications.map(n => {
              const colors = { warning: 'text-amber-400 bg-amber-400/10', success: 'text-green-400 bg-green-400/10', info: 'text-blue-400 bg-blue-400/10' };
              return (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[n.type]}`}>
                    <MdNotifications />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-xs font-semibold truncate">{n.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{n.message}</p>
                    <p className="text-slate-600 text-xs mt-1">{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Subject Grades + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grades Bar Chart */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-2 rounded-2xl p-5 border border-slate-200"
          style={{ background: 'rgba(255,255,255,1)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-slate-900 font-semibold">Subject Performance</h3>
            <span className="text-slate-500 text-xs">Semester 4</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gradeData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="grade" name="Grade" radius={[6, 6, 0, 0]}>
                {gradeData.map((entry, i) => (
                  <Cell key={i} fill={`hsl(${220 + i * 15}, 70%, ${55 + i * 3}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl p-5 border border-slate-200"
          style={{ background: 'rgba(255,255,255,1)' }}
        >
          <h3 className="text-slate-900 font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <Link key={action.label} to={action.path}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`rounded-xl p-3 bg-gradient-to-br ${action.color} flex flex-col items-center justify-center gap-2 h-20 cursor-pointer shadow-lg`}
                  >
                    <Icon className="text-slate-900 text-2xl" />
                    <span className="text-slate-900 text-xs font-semibold text-center">{action.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Assignments + Subject Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignments */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl p-5 border border-slate-200"
          style={{ background: 'rgba(255,255,255,1)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-semibold">Upcoming Homework</h3>
            <Link to="/academic/assignments" className="text-primary-400 text-xs hover:text-primary-300 flex items-center gap-1">
              View all <MdArrowForward />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingAssignments.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-slate-200">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${a.status === 'submitted' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {a.status === 'submitted' ? <MdCheckCircle className="text-xl" /> : <MdTimelapse className="text-xl" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm font-medium truncate">{a.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{a.subject} · Due: {a.due}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0 ${a.status === 'submitted' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {a.status === 'submitted' ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subject Attendance Donut */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl p-5 border border-slate-200"
          style={{ background: 'rgba(255,255,255,1)' }}
        >
          <h3 className="text-slate-900 font-semibold mb-4">Subject-wise Attendance</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={subjectAttendance} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {subjectAttendance.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {subjectAttendance.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-slate-500 text-xs flex-1 truncate">{s.name}</span>
                  <span className={`text-xs font-bold ${s.value < 75 ? 'text-red-400' : s.value < 85 ? 'text-amber-400' : 'text-green-400'}`}>
                    {s.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          {subjectAttendance.some(s => s.value < 75) && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              <MdWarning className="text-base flex-shrink-0 mt-0.5" />
              <span>Physics attendance is below 75%. Contact your tutor immediately.</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
