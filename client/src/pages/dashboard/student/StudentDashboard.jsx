import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdSchool, MdPayment, MdHotel, MdLocalLibrary,
  MdDirectionsBus, MdReport, MdNotifications, MdCalendarToday,
  MdCheckCircle, MdArrowForward,
} from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext';
import { staggerContainer, staggerItem } from '../../../animations/stagger';
import { fadeInUp } from '../../../animations/fadeIn';
import { feesService, attendanceService, libraryService, notificationService } from '../../../services/moduleServices';

// ─── Quick Actions ────────────────────────────────────────────────────────────
const quickActions = [
  { label: 'Pay Fees', icon: MdPayment, path: '/fees', color: 'from-green-500 to-emerald-600' },
  { label: 'Library', icon: MdLocalLibrary, path: '/library', color: 'from-blue-500 to-cyan-600' },
  { label: 'Hostel', icon: MdHotel, path: '/hostel', color: 'from-purple-500 to-violet-600' },
  { label: 'Transport', icon: MdDirectionsBus, path: '/transport', color: 'from-amber-500 to-orange-600' },
  { label: 'Complaint', icon: MdReport, path: '/core', color: 'from-red-500 to-rose-600' },
  { label: 'Certificate', icon: MdSchool, path: '/admission/certificate', color: 'from-indigo-500 to-blue-600' },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color }) => (
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
      </div>
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
        <Icon className="text-slate-900 text-xl" />
      </div>
    </div>
  </motion.div>
);

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [feesData, setFeesData] = useState({ totalAmount: 0, totalPaid: 0, totalPending: 0 });
  const [attendanceData, setAttendanceData] = useState({ total: 0, present: 0, overallPercentage: '0.00' });
  const [libraryData, setLibraryData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feesRes, attRes, libRes, notifRes] = await Promise.all([
          feesService.getStudentFees().catch(() => ({ data: { summary: { totalAmount: 0, totalPaid: 0, totalPending: 0 } } })),
          attendanceService.getMy().catch(() => ({ data: { summary: { total: 0, present: 0, overallPercentage: '0.00' } } })),
          libraryService.getIssuedBooks().catch(() => ({ data: { data: [] } })),
          notificationService.getAll().catch(() => ({ data: { data: [] } }))
        ]);
        
        setFeesData(feesRes?.data?.summary || { totalAmount: 0, totalPaid: 0, totalPending: 0 });
        setAttendanceData(attRes?.data?.summary || { total: 0, present: 0, overallPercentage: '0.00' });
        setLibraryData(libRes?.data?.data || []);
        setNotifications(notifRes?.data?.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading your dashboard...
      </div>
    );
  }

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
            <p className="text-slate-500 text-sm mt-1">Class {user?.department} · {user?.loginId} · Section A</p>
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
        </div>

        {/* Progress bars */}
        <div className="relative z-10 mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Attendance', value: Number(attendanceData.overallPercentage), color: '#6366f1' },
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
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatCard icon={MdCheckCircle} label="Attendance" value={`${attendanceData.overallPercentage}%`} sub={`${attendanceData.present}/${attendanceData.total} days`} color="from-primary-500 to-indigo-600" />
        <StatCard icon={MdPayment} label="Fees Due" value={`₹${feesData.totalPending.toLocaleString('en-IN')}`} sub="Pending amount" color="from-amber-500 to-orange-600" />
        <StatCard icon={MdLocalLibrary} label="Books Issued" value={libraryData.length} sub="Currently issued" color="from-cyan-500 to-blue-600" />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Notifications */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-2 rounded-2xl p-5 border border-slate-200"
          style={{ background: 'rgba(255,255,255,1)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-semibold">Notifications</h3>
            <span className="text-slate-500 text-xs">Recent</span>
          </div>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No recent notifications</p>
            ) : (
              notifications.slice(0, 5).map(n => {
                let colorClass = 'text-blue-400 bg-blue-400/10';
                if (n.type === 'success') colorClass = 'text-green-400 bg-green-400/10';
                if (n.type === 'warning') colorClass = 'text-amber-400 bg-amber-400/10';
                if (n.type === 'error') colorClass = 'text-red-400 bg-red-400/10';

                return (
                  <div key={n._id} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <MdNotifications className="text-lg" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-slate-900 text-sm font-semibold">{n.title}</h4>
                        <span className="text-slate-400 text-[10px]">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {notifications.length > 5 && (
            <button className="w-full mt-4 py-2 text-primary-600 text-xs font-semibold hover:bg-primary-50 rounded-lg transition-colors">
              View All Notifications
            </button>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl p-5 border border-slate-200"
          style={{ background: 'rgba(255,255,255,1)' }}
        >
          <h3 className="text-slate-900 font-semibold mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(action => (
              <Link
                key={action.label}
                to={action.path}
                className="group p-4 rounded-xl border border-slate-200 hover:border-primary-200 bg-slate-50 hover:bg-primary-50 transition-all text-center flex flex-col items-center justify-center gap-2"
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="text-white text-lg" />
                </div>
                <span className="text-slate-700 font-medium text-xs group-hover:text-primary-700 transition-colors">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
