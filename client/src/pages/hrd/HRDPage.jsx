import { motion } from 'framer-motion';
import { MdPeople, MdWork, MdAssignment, MdBarChart } from 'react-icons/md';
import { staggerContainer, staggerItem } from '../../animations/stagger';

const staff = [
  { name: 'Dr. Ramesh Kumar', dept: 'CSE', designation: 'Professor', loginId: 'TCH001', status: 'active', joinDate: '2015-07-01' },
  { name: 'Dr. Priya Sharma', dept: 'ECE', designation: 'Assoc. Professor', loginId: 'TCH002', status: 'active', joinDate: '2018-06-15' },
  { name: 'Mr. Anand Gupta', dept: 'MBA', designation: 'Assistant Professor', loginId: 'TCH003', status: 'active', joinDate: '2020-08-01' },
  { name: 'Ms. Kavitha R.', dept: 'MECH', designation: 'Professor', loginId: 'TCH004', status: 'on_leave', joinDate: '2012-07-10' },
];

const HRDPage = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-white text-2xl font-bold">Human Resource Development</h1>
      <p className="text-slate-400 text-sm mt-1">Manage faculty, staff records and HR operations</p>
    </motion.div>

    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[['Total Staff', '89', MdPeople, 'from-primary-500 to-indigo-600'], ['Departments', '12', MdWork, 'from-violet-500 to-purple-600'],
        ['On Leave', '4', MdAssignment, 'from-amber-500 to-orange-600'], ['New Joiners', '6', MdBarChart, 'from-green-500 to-emerald-600']].map(([l, v, Icon, color]) => (
        <motion.div key={l} variants={staggerItem} whileHover={{ y: -4 }}
          className="rounded-2xl p-5 border border-white/5 relative overflow-hidden" style={{ background: 'rgba(30,41,59,0.8)' }}>
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 bg-gradient-to-br ${color}`} />
          <div className="relative flex items-start justify-between">
            <div><p className="text-slate-400 text-xs uppercase tracking-wider">{l}</p><p className="text-white text-3xl font-bold mt-1">{v}</p></div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}><Icon className="text-white text-lg" /></div>
          </div>
        </motion.div>
      ))}
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: 'rgba(30,41,59,0.8)' }}>
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-white font-semibold">Staff Directory</h3>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors">Add Staff</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/5">
            {['Name', 'Department', 'Designation', 'Login ID', 'Join Date', 'Status'].map(h => (
              <th key={h} className="text-left text-slate-500 text-xs font-medium p-4">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {staff.map(s => (
              <tr key={s.loginId} className="hover:bg-white/3 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">{s.name.charAt(0)}</div>
                    <span className="text-white text-xs">{s.name}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-400 text-xs">{s.dept}</td>
                <td className="p-4 text-slate-400 text-xs">{s.designation}</td>
                <td className="p-4 text-slate-400 text-xs font-mono">{s.loginId}</td>
                <td className="p-4 text-slate-400 text-xs">{s.joinDate}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {s.status === 'active' ? 'Active' : 'On Leave'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  </div>
);

export default HRDPage;
