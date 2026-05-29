import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MdSchool, MdPeople, MdHelp, MdBeachAccess, MdCheckCircle,
  MdSchedule, MdAssignment, MdNotifications, MdQuiz, MdCalendarToday,
  MdEventNote, MdPlayArrow, MdBook, MdArrowForward,
} from 'react-icons/md';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { staggerContainer, staggerItem } from '../../../animations/stagger';
import { fadeInUp } from '../../../animations/fadeIn';
import { dashboardService } from '../../../services/moduleServices';

const cardStyle = {
  background: 'rgba(255,255,255,1)',
};

const attendanceData = [
  { month: 'Jan', taken: 18, expected: 20 },
  { month: 'Feb', taken: 16, expected: 18 },
  { month: 'Mar', taken: 22, expected: 24 },
  { month: 'Apr', taken: 19, expected: 20 },
  { month: 'May', taken: 15, expected: 16 },
  { month: 'Jun', taken: 20, expected: 22 },
];

const timetable = [
  { time: '08:00 – 08:45', subject: 'Mathematics', class: 'X-A', room: 'R-101', color: 'bg-blue-500' },
  { time: '09:00 – 09:45', subject: 'Mathematics', class: 'IX-B', room: 'R-204', color: 'bg-indigo-500' },
  { time: '10:30 – 11:15', subject: 'Advanced Calculus', class: 'XI-Science', room: 'R-302', color: 'bg-purple-500' },
  { time: '11:30 – 12:15', subject: 'Statistics', class: 'XII-Commerce', room: 'R-110', color: 'bg-pink-500' },
];

const notifications = [
  { icon: MdCheckCircle, text: 'Question paper "Mid-Term X" approved by Principal', time: '2h ago', color: 'text-green-500' },
  { icon: MdAssignment, text: '14 students submitted Assignment #4 (Class X-A)', time: '5h ago', color: 'text-blue-500' },
  { icon: MdHelp, text: 'New doubt posted by Rahul Sharma (XI-Science)', time: '1d ago', color: 'text-amber-500' },
  { icon: MdNotifications, text: 'Staff meeting scheduled for tomorrow at 10:00 AM', time: '1d ago', color: 'text-purple-500' },
];

const quickActions = [
  { label: 'Question Bank', icon: MdQuiz, color: 'from-blue-500 to-blue-600' },
  { label: 'My Timetable', icon: MdSchedule, color: 'from-indigo-500 to-indigo-600' },
  { label: 'Apply Leave', icon: MdBeachAccess, color: 'from-pink-500 to-pink-600' },
  { label: 'Homework', icon: MdAssignment, color: 'from-purple-500 to-purple-600' },
  { label: 'Mark Attendance', icon: MdCheckCircle, color: 'from-green-500 to-green-600' },
  { label: 'Lesson Plan', icon: MdBook, color: 'from-teal-500 to-teal-600' },
];

const statusBadge = (status) => {
  const map = {
    approved: 'bg-green-100 text-green-700 border border-green-200',
    pending: 'bg-amber-100 text-amber-700 border border-amber-200',
    draft: 'bg-slate-100 text-slate-700 border border-slate-200',
    rejected: 'bg-red-100 text-red-700 border border-red-200',
  };
  return map[status] || map.draft;
};

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <motion.div variants={staggerItem} style={cardStyle}
    className="rounded-2xl p-5 border border-slate-200 flex items-center gap-4 hover:shadow-sm transition-shadow">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="text-white text-2xl" />
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <p className="text-slate-900 text-2xl font-bold">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading live data...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Banner */}
      <motion.div {...fadeInUp}
        className="rounded-2xl p-6 border border-slate-200 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4c1d95 100%)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Welcome back,</p>
            <h1 className="text-white text-2xl font-bold">{user?.name}</h1>
            <p className="text-blue-100 text-sm mt-1">{user?.department} Dept · Login ID: {user?.loginId}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 bg-white/10 rounded-lg text-white text-xs">AY 2024-25</span>
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-200 text-xs flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" /> Live Updating
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <div style={cardStyle} className="rounded-xl px-4 py-2 border border-slate-200 text-center shadow-sm">
              <p className="text-slate-900 font-bold text-lg">4</p>
              <p className="text-slate-500 text-xs font-medium">Classes Today</p>
            </div>
            <div style={cardStyle} className="rounded-xl px-4 py-2 border border-slate-200 text-center shadow-sm">
              <p className="text-slate-900 font-bold text-lg">12</p>
              <p className="text-slate-500 text-xs font-medium">Leave Days</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MdSchool} label="Classes Today" value="4" color="bg-gradient-to-br from-blue-500 to-blue-600" sub="Next at 10:30 AM" />
        <StatCard icon={MdPeople} label="My Students" value={data?.stats?.myStudents || 0} color="bg-gradient-to-br from-indigo-500 to-indigo-600" sub={`In ${user?.department}`} />
        <StatCard icon={MdHelp} label="Pending Questions" value={data?.stats?.pendingQuestionsCount || 0} color="bg-gradient-to-br from-amber-500 to-orange-500" sub="Need approval" />
        <StatCard icon={MdCheckCircle} label="Attendance" value={data?.stats?.attendanceMarkedToday || 0} color="bg-gradient-to-br from-green-500 to-emerald-600" sub="Marked today" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Timetable */}
        <motion.div {...fadeInUp} style={cardStyle}
          className="lg:col-span-2 rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-900 font-semibold text-lg flex items-center gap-2">
              <MdSchedule className="text-blue-500" /> Today's Timetable
            </h2>
            <span className="text-slate-500 text-sm font-medium">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="space-y-3">
            {timetable.map((cls, i) => (
              <div key={i} className={`flex items-center gap-4 rounded-xl p-3 bg-slate-50 border-l-4 ${cls.color}`}>
                <div className="w-28 shrink-0">
                  <p className="text-slate-700 text-xs font-mono font-semibold">{cls.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 text-sm font-semibold">{cls.subject}</p>
                  <p className="text-slate-500 text-xs">{cls.class}</p>
                </div>
                <span className="text-slate-600 text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-medium shadow-sm">{cls.room}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div {...fadeInUp} style={cardStyle} className="rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h2 className="text-slate-900 font-semibold text-lg mb-4 flex items-center gap-2">
            <MdNotifications className="text-purple-500" /> Notifications
          </h2>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <n.icon className={`text-xl shrink-0 mt-0.5 ${n.color}`} />
                <div>
                  <p className="text-slate-700 text-sm font-medium leading-snug">{n.text}</p>
                  <p className="text-slate-500 text-xs mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Question Bank Status */}
        <motion.div {...fadeInUp} style={cardStyle} className="rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h2 className="text-slate-900 font-semibold text-lg mb-4 flex items-center gap-2">
            <MdQuiz className="text-amber-500" /> Pending Approvals
          </h2>
          <div className="space-y-2">
            {data?.stats?.pendingQuestionsCount > 0 ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm font-semibold">{data.stats.pendingQuestionsCount} Papers Pending Approval</p>
                  <p className="text-slate-500 text-xs mt-1">Please check the question bank.</p>
                </div>
                <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg px-3 py-1.5 transition-colors">View</button>
              </div>
            ) : (
              <div className="p-4 text-center text-slate-500 text-sm">
                No papers currently pending approval.
              </div>
            )}
          </div>
        </motion.div>

        {/* Attendance Marking */}
        <motion.div {...fadeInUp} style={cardStyle} className="rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h2 className="text-slate-900 font-semibold text-lg mb-4 flex items-center gap-2">
            <MdCheckCircle className="text-green-500" /> Quick Mark Attendance
          </h2>
          <div className="space-y-2">
            {timetable.slice(0, 3).map((cls, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors">
                <div>
                  <p className="text-slate-900 text-sm font-semibold">{cls.subject} – {cls.class}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{cls.time} · {cls.room}</p>
                </div>
                <button className="flex items-center gap-1 text-xs bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg px-3 py-1.5 transition-all shadow-sm">
                  <MdPlayArrow className="text-sm" /> Mark
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Monthly Attendance Chart */}
        <motion.div {...fadeInUp} style={cardStyle} className="rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h2 className="text-slate-900 font-semibold text-lg mb-4 flex items-center gap-2">
            <MdCalendarToday className="text-cyan-500" /> Monthly Classes Taken
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, color: '#333' }} />
              <Legend wrapperStyle={{ color: '#64748b', fontSize: 12 }} />
              <Bar dataKey="taken" name="Classes Taken" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expected" name="Expected" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeInUp} style={cardStyle} className="rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h2 className="text-slate-900 font-semibold text-lg mb-4 flex items-center gap-2">
            <MdEventNote className="text-indigo-500" /> Quick Actions
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, i) => (
              <button key={i}
                className={`bg-gradient-to-br ${action.color} rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm h-24`}>
                <action.icon className="text-white text-2xl" />
                <span className="text-white text-xs font-semibold text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
