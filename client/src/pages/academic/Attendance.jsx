import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdCheckCircle, MdCancel, MdAccessTime, MdBarChart } from 'react-icons/md';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { fadeInUp } from '../../animations/fadeIn';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const subjects = ['Data Structures', 'Algorithm Design', 'Database Lab', 'OS Concepts', 'Software Eng'];
const mockStudents = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown', 'Eva Martinez', 'Frank Lee'];

const mockAttendance = [
  { date: '2024-06-18', subject: 'Data Structures', status: 'present' },
  { date: '2024-06-18', subject: 'Algorithm Design', status: 'absent' },
  { date: '2024-06-17', subject: 'Database Lab', status: 'present' },
  { date: '2024-06-17', subject: 'OS Concepts', status: 'present' },
  { date: '2024-06-16', subject: 'Data Structures', status: 'late' },
  { date: '2024-06-16', subject: 'Software Eng', status: 'present' },
];

const subjectStats = subjects.map(s => {
  const total = 20; const present = Math.floor(Math.random() * 5) + 14;
  return { subject: s, present, total, pct: Math.round((present / total) * 100) };
});

const Attendance = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [marking, setMarking] = useState({});
  const [saved, setSaved] = useState(false);

  const handleMark = (student, status) => setMarking(prev => ({ ...prev, [student]: status }));

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 200));
    setSaved(true);
    toast.success('Attendance saved successfully!');
  };

  const pieData = [
    { name: 'Present', value: 88, color: '#10b981' },
    { name: 'Absent', value: 7, color: '#ef4444' },
    { name: 'Late', value: 5, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <h1 className="text-slate-900 text-2xl font-bold">Attendance</h1>
        <p className="text-slate-500 text-sm mt-1">{isTeacher ? 'Mark and manage student attendance' : 'Your attendance records'}</p>
      </motion.div>

      {/* Student View */}
      {!isTeacher && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeInUp} className="rounded-2xl p-5 border border-slate-200" style={{ background: 'rgba(255,255,255,1)' }}>
            <h3 className="text-slate-900 font-semibold mb-4">Overall Attendance</h3>
            <div className="flex items-center gap-6">
              <div style={{ width: 140, height: 140 }}>
                <PieChart width={140} height={140}>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3} isAnimationActive={false}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `${v}%`} />
                </PieChart>
              </div>
              <div className="space-y-2">
                {pieData.map(p => (
                  <div key={p.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-slate-500 text-xs">{p.name}</span>
                    <span className="text-slate-900 text-xs font-bold ml-auto">{p.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} className="rounded-2xl p-5 border border-slate-200" style={{ background: 'rgba(255,255,255,1)' }}>
            <h3 className="text-slate-900 font-semibold mb-4">Subject-wise</h3>
            <div className="space-y-3">
              {subjectStats.map(s => (
                <div key={s.subject}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 truncate max-w-[60%]">{s.subject}</span>
                    <span className={`font-bold ${s.pct < 75 ? 'text-red-400' : s.pct < 85 ? 'text-amber-400' : 'text-green-400'}`}>{s.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ delay: 0.3, duration: 0.8 }}
                      className={`h-full rounded-full ${s.pct < 75 ? 'bg-red-500' : s.pct < 85 ? 'bg-amber-500' : 'bg-green-500'}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} className="lg:col-span-2 rounded-2xl border border-slate-200 overflow-hidden" style={{ background: 'rgba(255,255,255,1)' }}>
            <div className="p-5 border-b border-slate-200"><h3 className="text-slate-900 font-semibold">Recent Attendance</h3></div>
            <div className="divide-y divide-slate-200">
              {mockAttendance.map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.status === 'present' ? 'bg-green-500/20 text-green-400' : a.status === 'absent' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {a.status === 'present' ? <MdCheckCircle /> : a.status === 'absent' ? <MdCancel /> : <MdAccessTime />}
                  </div>
                  <div className="flex-1"><p className="text-slate-900 text-sm font-medium">{a.subject}</p><p className="text-slate-500 text-xs">{a.date}</p></div>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium capitalize ${a.status === 'present' ? 'bg-green-500/20 text-green-400' : a.status === 'absent' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Teacher View */}
      {isTeacher && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {subjects.map(s => (
              <button key={s} onClick={() => { setSelectedSubject(s); setSaved(false); setMarking({}); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSubject === s ? 'bg-primary-600 text-slate-900' : 'bg-slate-50 text-slate-500 hover:text-slate-900 border border-slate-200'}`}>
                {s}
              </button>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-slate-200 overflow-hidden" style={{ background: 'rgba(255,255,255,1)' }}>
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-slate-900 font-semibold">{selectedSubject}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} · CSE-4A</p>
                </div>
                {!saved && <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-slate-900 rounded-xl text-sm font-medium transition-colors">Save Attendance</button>}
                {saved && <span className="flex items-center gap-1 text-green-400 text-sm"><MdCheckCircle />Saved!</span>}
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {mockStudents.map(student => {
                const status = marking[student];
                return (
                  <div key={student} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-slate-900 text-xs font-bold">{student.charAt(0)}</div>
                      <span className="text-slate-900 text-sm">{student}</span>
                    </div>
                    <div className="flex gap-2">
                      {[['present', 'P', 'bg-green-600/20 text-green-400 hover:bg-green-600/40', 'bg-green-600 text-slate-900'],
                        ['absent', 'A', 'bg-red-600/20 text-red-400 hover:bg-red-600/40', 'bg-red-600 text-slate-900'],
                        ['late', 'L', 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/40', 'bg-amber-600 text-slate-900']].map(([val, label, base, active]) => (
                        <button key={val} onClick={() => handleMark(student, val)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${status === val ? active : base}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
