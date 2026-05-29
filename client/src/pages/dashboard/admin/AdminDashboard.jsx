import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  MdPeople, MdPayment, MdHotel, MdSchool, MdBarChart,
  MdCheckCircle, MdWarning, MdSettings, MdLocalLibrary,
  MdDirectionsBus, MdReport, MdArrowForward,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { staggerContainer, staggerItem } from '../../../animations/stagger';
import { fadeInUp } from '../../../animations/fadeIn';
import { dashboardService } from '../../../services/moduleServices';

// Dummy fallback for charts since they are complex to aggregate purely backend
const revenueData = [
  { month: 'Jan', collected: 842000 }, { month: 'Feb', collected: 930000 },
  { month: 'Mar', collected: 765000 }, { month: 'Apr', collected: 1120000 },
  { month: 'May', collected: 988000 }, { month: 'Jun', collected: 1340000 },
];

const T = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-xl text-sm">
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className="text-slate-900 font-semibold">₹{(payload[0].value / 100000).toFixed(1)}L</p>
    </div>
  );
  return null;
};

const roleColors = { student: 'bg-blue-500/20 text-blue-400', teacher: 'bg-green-500/20 text-green-400', admin: 'bg-red-500/20 text-red-400' };
const priorityColors = { high: 'text-red-400', medium: 'text-amber-400', low: 'text-green-400' };

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    // Poll every 15 seconds for real-time updates
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const stats = data ? [
    { label: 'Total Users', value: data.stats.totalUsers, icon: MdPeople, color: 'from-primary-500 to-indigo-600', sub: `${data.stats.totalStudents} students` },
    { label: 'Active Today', value: data.stats.activeToday, icon: MdSchool, color: 'from-green-500 to-emerald-600', sub: 'Logins in 24h' },
    { label: 'Fees Collected', value: `₹${(data.stats.feesCollected / 100000).toFixed(1)}L`, icon: MdPayment, color: 'from-amber-500 to-orange-600', sub: 'Total collected' },
    { label: 'Pending Requests', value: data.stats.pendingRequests, icon: MdWarning, color: 'from-red-500 to-rose-600', sub: 'Need action' },
    { label: 'Library Books', value: data.stats.totalBooks, icon: MdLocalLibrary, color: 'from-cyan-500 to-blue-600', sub: `${data.stats.issuedBooks} issued` },
  ] : [];

  const quickActions = [
    { label: 'Manage Users', icon: MdPeople, path: '/hrd', color: 'from-primary-500 to-indigo-600' },
    { label: 'Fee Structure', icon: MdPayment, path: '/fees', color: 'from-amber-500 to-orange-600' },
    { label: 'Hostel Admin', icon: MdHotel, path: '/hostel', color: 'from-violet-500 to-purple-600' },
    { label: 'Routes', icon: MdDirectionsBus, path: '/transport', color: 'from-cyan-500 to-blue-600' },
    { label: 'Library', icon: MdLocalLibrary, path: '/library', color: 'from-green-500 to-emerald-600' },
    { label: 'Certificates', icon: MdSchool, path: '/admission/certificate', color: 'from-pink-500 to-rose-600' },
  ];

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
      <motion.div variants={fadeInUp} initial="initial" animate="animate"
        className="relative rounded-3xl p-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', border: '1px solid rgba(6,182,212,0.2)' }}>
        <div className="absolute w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl -top-10 right-20" />
        <div className="relative z-10">
          <p className="text-cyan-300 text-sm font-medium">⚙️ Administrator Control Panel</p>
          <h1 className="text-white text-2xl font-bold mt-1">{user?.name}</h1>
          <p className="text-slate-300 text-sm mt-1">System Admin · {user?.loginId} · Full Access</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 text-xs flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" /> Live Updating
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(s => (
          <motion.div key={s.label} variants={staggerItem} whileHover={{ y: -4 }}
            className="rounded-2xl p-5 border border-slate-200 relative overflow-hidden" style={{ background: 'rgba(255,255,255,1)' }}>
            <div className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-10 bg-gradient-to-br ${s.color}`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{s.label}</p>
                <p className="text-slate-900 text-2xl font-bold mt-1">{s.value}</p>
                <p className="text-slate-500 text-xs mt-1">{s.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                <s.icon className="text-white text-lg" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 rounded-2xl p-5 border border-slate-200" style={{ background: 'rgba(255,255,255,1)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-semibold">Fee Collection Overview</h3>
            <span className="text-slate-500 text-xs">2024</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 100000}L`} />
              <Tooltip content={<T />} />
              <Area type="monotone" dataKey="collected" stroke="#6366f1" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeInUp} className="rounded-2xl p-5 border border-slate-200" style={{ background: 'rgba(255,255,255,1)' }}>
          <h3 className="text-slate-900 font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(a => (
              <motion.button key={a.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate(a.path)}
                className={`rounded-xl p-3 bg-gradient-to-br ${a.color} flex flex-col items-center justify-center gap-1.5 h-[72px] shadow-lg`}>
                <a.icon className="text-white text-xl" />
                <span className="text-white text-xs font-semibold text-center leading-tight">{a.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Logins */}
      <motion.div variants={fadeInUp} className="rounded-2xl p-5 border border-slate-200" style={{ background: 'rgba(255,255,255,1)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 font-semibold">Recent User Activity</h3>
          <span className="text-slate-500 text-xs">Live Feed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {['User', 'Login ID', 'Role', 'Department', 'Last Activity', 'Status'].map(h => (
                  <th key={h} className="text-left text-slate-500 text-xs font-medium pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data?.recentLogins?.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-slate-900 text-xs">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-500 text-xs font-mono">{u.loginId}</td>
                  <td className="py-3 pr-4"><span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[u.role] || 'bg-slate-500/20 text-slate-500'}`}>{u.role}</span></td>
                  <td className="py-3 pr-4 text-slate-500 text-xs">{u.department}</td>
                  <td className="py-3 pr-4 text-slate-500 text-xs">
                    {new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full bg-green-400`} />
                      <span className="text-xs text-green-400">Online</span>
                    </div>
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

export default AdminDashboard;
