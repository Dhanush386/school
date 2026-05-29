import { motion } from 'framer-motion';
import { MdPeople, MdTrendingUp, MdEventAvailable, MdAccountBalance, MdDownload } from 'react-icons/md';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fadeInUp } from '../../animations/fadeIn';
import { staggerContainer, staggerItem } from '../../animations/stagger';
import toast from 'react-hot-toast';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const feeData = months.map((m, i) => ({ month: m, amount: [185000, 210000, 195000, 220000, 198000, 240000][i] }));
const attendData = months.map((m, i) => ({ month: m, pct: [88, 91, 87, 93, 89, 91][i] }));

const deptStats = [
  { dept: 'Class XII', students: 320, passRate: 91, color: 'bg-blue-500' },
  { dept: 'Class XI', students: 280, passRate: 87, color: 'bg-violet-500' },
  { dept: 'Class X', students: 240, passRate: 82, color: 'bg-amber-500' },
  { dept: 'Class IX', students: 200, passRate: 89, color: 'bg-green-500' },
  { dept: 'Class VIII', students: 200, passRate: 78, color: 'bg-rose-500' },
];

const stats = [
  { label: 'Total Students', value: '1,240', icon: MdPeople, color: 'from-primary-500 to-indigo-600', sub: '+48 this semester' },
  { label: 'Pass Rate', value: '87%', icon: MdTrendingUp, color: 'from-green-500 to-emerald-600', sub: '+2.3% vs last sem' },
  { label: 'Avg Attendance', value: '91%', icon: MdEventAvailable, color: 'from-amber-500 to-orange-600', sub: 'Above 75% threshold' },
  { label: 'Fee Collected', value: '₹18.4L', icon: MdAccountBalance, color: 'from-violet-500 to-purple-600', sub: '94% of target' },
];

const ReportsPage = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const academicYear = currentMonth < 5 
    ? `${currentYear - 1}-${String(currentYear).slice(2)}` 
    : `${currentYear}-${String(currentYear + 1).slice(2)}`;

  return (
  <div className="space-y-6">
    <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-start justify-between">
      <div>
        <h1 className="text-white text-2xl font-bold">Reports & Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Academic Year {academicYear} · All Classes</p>
      </div>
      <button onClick={() => toast('Generating PDF report...', { icon: '📄' })}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors">
        <MdDownload /> Export Report
      </button>
    </motion.div>

    {/* Stat cards */}
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(s => (
        <motion.div key={s.label} variants={staggerItem} whileHover={{ y: -4 }}
          className="rounded-2xl p-5 border border-white/5 relative overflow-hidden" style={{ background: 'rgba(30,41,59,0.8)' }}>
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 bg-gradient-to-br ${s.color}`} />
          <div className="relative flex items-start justify-between mb-2">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
              <s.icon className="text-white text-lg" />
            </div>
          </div>
          <p className="text-white text-2xl font-bold">{s.value}</p>
          <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
          <p className="text-slate-600 text-xs mt-1">{s.sub}</p>
        </motion.div>
      ))}
    </motion.div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div variants={fadeInUp} initial="initial" animate="animate"
        className="rounded-2xl p-5 border border-white/5" style={{ background: 'rgba(30,41,59,0.8)' }}>
        <h3 className="text-white font-semibold mb-4">Monthly Fee Collection (₹)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={feeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
            <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Collection']} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            <Bar dataKey="amount" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div variants={fadeInUp} initial="initial" animate="animate"
        className="rounded-2xl p-5 border border-white/5" style={{ background: 'rgba(30,41,59,0.8)' }}>
        <h3 className="text-white font-semibold mb-4">Attendance Trend (%)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={attendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[80, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip formatter={v => [`${v}%`, 'Attendance']} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            <Line type="monotone" dataKey="pct" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>

    {/* Department table */}
    <motion.div variants={fadeInUp} initial="initial" animate="animate"
      className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: 'rgba(30,41,59,0.8)' }}>
      <div className="p-5 border-b border-white/5">
        <h3 className="text-white font-semibold">Class-wise Performance</h3>
      </div>
      <div className="divide-y divide-white/5">
        {deptStats.map(d => (
          <div key={d.dept} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
            <div className={`w-2 h-10 rounded-full ${d.color} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{d.dept}</p>
              <p className="text-slate-500 text-xs">{d.students} students</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${d.passRate >= 90 ? 'text-green-400' : d.passRate >= 85 ? 'text-amber-400' : 'text-red-400'}`}>{d.passRate}%</p>
              <p className="text-slate-500 text-xs">pass rate</p>
            </div>
            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${d.passRate}%` }} transition={{ delay: 0.5, duration: 0.8 }}
                className={`h-full rounded-full ${d.passRate >= 90 ? 'bg-green-500' : d.passRate >= 85 ? 'bg-amber-500' : 'bg-red-500'}`} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
  );
};

export default ReportsPage;
