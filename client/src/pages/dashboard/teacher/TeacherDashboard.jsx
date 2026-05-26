import React from 'react';
import { motion } from 'framer-motion';
import {
  MdSchool, MdPeople, MdHelp, MdBeachAccess, MdCheckCircle,
  MdSchedule, MdAssignment, MdNotifications, MdQuiz, MdCalendarToday,
  MdEventNote, MdPlayArrow, MdBook, MdArrowForward,
} from 'react-icons/md';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { staggerContainer, staggerItem } from '../../../animations/stagger';
import { fadeInUp } from '../../../animations/fadeIn';

const cardStyle = {
  background: 'rgba(255,255,255,1)',
  backdropFilter: 'blur(12px)',
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
  { time: '13:30 – 14:15', subject: 'Mathematics', class: 'X-C', room: 'R-101', color: 'bg-cyan-500' },
  { time: '14:30 – 15:15', subject: 'Remedial Math', class: 'IX-A', room: 'R-205', color: 'bg-teal-500' },
];

const questionPapers = [
  { title: 'Mid-Term Exam – Class X', subject: 'Mathematics', status: 'approved', date: '20 May' },
  { title: 'Unit Test 3 – Class IX', subject: 'Mathematics', status: 'pending', date: '22 May' },
  { title: 'Statistics Quiz – XII Com', subject: 'Statistics', status: 'draft', date: '23 May' },
  { title: 'Annual Exam – Class XI', subject: 'Calculus', status: 'rejected', date: '18 May' },
];

const notifications = [
  { icon: MdCheckCircle, text: 'Question paper "Mid-Term X" approved by Principal', time: '2h ago', color: 'text-green-400' },
  { icon: MdAssignment, text: '14 students submitted Assignment #4 (Class X-A)', time: '5h ago', color: 'text-blue-400' },
  { icon: MdHelp, text: 'New doubt posted by Rahul Sharma (XI-Science)', time: '1d ago', color: 'text-yellow-400' },
  { icon: MdNotifications, text: 'Staff meeting scheduled for tomorrow at 10:00 AM', time: '1d ago', color: 'text-purple-400' },
];

const quickActions = [
  { label: 'Question Bank', icon: MdQuiz, color: 'from-blue-600 to-blue-800' },
  { label: 'My Timetable', icon: MdSchedule, color: 'from-indigo-600 to-indigo-800' },
  { label: 'Apply Leave', icon: MdBeachAccess, color: 'from-pink-600 to-pink-800' },
  { label: 'Homework', icon: MdAssignment, color: 'from-purple-600 to-purple-800' },
  { label: 'Mark Attendance', icon: MdCheckCircle, color: 'from-green-600 to-green-800' },
  { label: 'Lesson Plan', icon: MdBook, color: 'from-teal-600 to-teal-800' },
];

const statusBadge = (status) => {
  const map = {
    approved: 'bg-green-500/20 text-green-400 border border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    draft: 'bg-slate-500/20 text-slate-500 border border-slate-500/30',
    rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };
  return map[status] || map.draft;
};

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <motion.div variants={staggerItem} style={cardStyle}
    className="rounded-2xl p-5 border border-slate-200 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="text-slate-900 text-2xl" />
    </div>
    <div>
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-slate-900 text-2xl font-bold">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 space-y-6">

      {/* Banner */}
      <motion.div {...fadeInUp}
        className="rounded-2xl p-6 border border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-blue-300 text-sm font-medium mb-1">Welcome back,</p>
            <h1 className="text-slate-900 text-2xl font-bold">Mrs. Priya Sharma</h1>
            <p className="text-slate-700 text-sm mt-1">Mathematics Dept · Login ID: TCH-2024-047 · 4 Subjects</p>
          </div>
          <div className="flex gap-3">
            <div style={cardStyle} className="rounded-xl px-4 py-2 border border-slate-200 text-center">
              <p className="text-slate-900 font-bold text-lg">5</p>
              <p className="text-slate-500 text-xs">Classes Today</p>
            </div>
            <div style={cardStyle} className="rounded-xl px-4 py-2 border border-slate-200 text-center">
              <p className="text-slate-900 font-bold text-lg">12</p>
              <p className="text-slate-500 text-xs">Leave Days</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MdSchool} label="Classes Today" value="5" color="bg-gradient-to-br from-blue-600 to-blue-800" sub="Next at 10:30 AM" />
        <StatCard icon={MdPeople} label="My Students" value="128" color="bg-gradient-to-br from-indigo-600 to-indigo-800" sub="Across 4 classes" />
        <StatCard icon={MdHelp} label="Pending Questions" value="3" color="bg-gradient-to-br from-yellow-600 to-orange-700" sub="In question bank" />
        <StatCard icon={MdBeachAccess} label="Leave Balance" value="12 days" color="bg-gradient-to-br from-green-600 to-teal-700" sub="This academic year" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Timetable */}
        <motion.div {...fadeInUp} style={cardStyle}
          className="lg:col-span-2 rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-900 font-semibold text-lg flex items-center gap-2">
              <MdSchedule className="text-blue-400" /> Today's Timetable
            </h2>
            <span className="text-slate-500 text-sm">Sunday, 24 May 2026</span>
          </div>
          <div className="space-y-2">
            {timetable.map((cls, i) => (
              <div key={i} className={`flex items-center gap-4 rounded-xl p-3 bg-slate-50 border-l-4 ${cls.color}`}>
                <div className="w-28 shrink-0">
                  <p className="text-slate-700 text-xs font-mono">{cls.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 text-sm font-medium">{cls.subject}</p>
                  <p className="text-slate-500 text-xs">{cls.class}</p>
                </div>
                <span className="text-slate-500 text-xs bg-slate-50 rounded-lg px-2 py-1">{cls.room}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div {...fadeInUp} style={cardStyle} className="rounded-2xl p-5 border border-slate-200">
          <h2 className="text-slate-900 font-semibold text-lg mb-4 flex items-center gap-2">
            <MdNotifications className="text-purple-400" /> Notifications
          </h2>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50">
                <n.icon className={`text-xl shrink-0 mt-0.5 ${n.color}`} />
                <div>
                  <p className="text-slate-700 text-sm leading-snug">{n.text}</p>
                  <p className="text-slate-500 text-xs mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Question Bank Status */}
        <motion.div {...fadeInUp} style={cardStyle} className="rounded-2xl p-5 border border-slate-200">
          <h2 className="text-slate-900 font-semibold text-lg mb-4 flex items-center gap-2">
            <MdQuiz className="text-yellow-400" /> Question Bank Status
          </h2>
          <div className="space-y-2">
            {questionPapers.map((qp, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm font-medium truncate">{qp.title}</p>
                  <p className="text-slate-500 text-xs">{qp.subject} · {qp.date}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg capitalize ${statusBadge(qp.status)}`}>{qp.status}</span>
                <div className="flex gap-1">
                  {qp.status === 'draft' && (
                    <button className="text-xs bg-blue-600 hover:bg-blue-700 text-slate-900 rounded-lg px-2 py-1 transition-colors">Submit</button>
                  )}
                  <button className="text-xs bg-slate-100 hover:bg-white/20 text-slate-700 rounded-lg px-2 py-1 transition-colors">View</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Attendance Marking */}
        <motion.div {...fadeInUp} style={cardStyle} className="rounded-2xl p-5 border border-slate-200">
          <h2 className="text-slate-900 font-semibold text-lg mb-4 flex items-center gap-2">
            <MdCheckCircle className="text-green-400" /> Mark Attendance
          </h2>
          <div className="space-y-2">
            {timetable.slice(0, 4).map((cls, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <p className="text-slate-900 text-sm font-medium">{cls.subject} – {cls.class}</p>
                  <p className="text-slate-500 text-xs">{cls.time} · {cls.room}</p>
                </div>
                <button className="flex items-center gap-1 text-xs bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-slate-900 rounded-lg px-3 py-1.5 transition-all">
                  <MdPlayArrow className="text-base" /> Mark
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Monthly Attendance Chart */}
        <motion.div {...fadeInUp} style={cardStyle} className="rounded-2xl p-5 border border-slate-200">
          <h2 className="text-slate-900 font-semibold text-lg mb-4 flex items-center gap-2">
            <MdCalendarToday className="text-cyan-400" /> Monthly Classes
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Bar dataKey="taken" name="Classes Taken" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expected" name="Expected" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeInUp} style={cardStyle} className="rounded-2xl p-5 border border-slate-200">
          <h2 className="text-slate-900 font-semibold text-lg mb-4 flex items-center gap-2">
            <MdEventNote className="text-indigo-400" /> Quick Actions
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, i) => (
              <button key={i}
                className={`bg-gradient-to-br ${action.color} rounded-xl p-3 flex flex-col items-center gap-2 hover:opacity-90 transition-opacity`}>
                <action.icon className="text-slate-900 text-2xl" />
                <span className="text-slate-900 text-xs font-medium text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
