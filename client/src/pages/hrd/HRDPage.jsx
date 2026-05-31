import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdPeople, MdWork, MdAssignment, MdBarChart } from 'react-icons/md';
import { staggerContainer, staggerItem } from '../../animations/stagger';
import axiosInstance from '../../api/axiosInstance';

const HRDPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/users/staff');
      if (data.success) {
        setStaff(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStaff = staff.length;
  const uniqueDepts = new Set(staff.map(s => s.department)).size;
  const onLeave = staff.filter(s => !s.isActive).length;
  const newJoiners = staff.filter(s => {
    const joinDate = new Date(s.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joinDate >= thirtyDaysAgo;
  }).length;

  return (
    <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-slate-900 text-2xl font-bold">Human Resource Development</h1>
      <p className="text-slate-500 text-sm mt-1">Manage faculty, staff records and HR operations</p>
    </motion.div>

    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        ['Total Staff', totalStaff, MdPeople, 'from-primary-500 to-indigo-600'], 
        ['Departments', uniqueDepts, MdWork, 'from-violet-500 to-purple-600'],
        ['On Leave', onLeave, MdAssignment, 'from-amber-500 to-orange-600'], 
        ['New Joiners', newJoiners, MdBarChart, 'from-green-500 to-emerald-600']
      ].map(([l, v, Icon, color]) => (
        <motion.div key={l} variants={staggerItem} whileHover={{ y: -4 }}
          className="rounded-2xl p-5 border border-slate-200 bg-white relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 bg-gradient-to-br ${color}`} />
          <div className="relative flex items-start justify-between">
            <div><p className="text-slate-500 text-xs uppercase tracking-wider">{l}</p><p className="text-slate-900 text-3xl font-bold mt-1">{v}</p></div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}><Icon className="text-white text-lg" /></div>
          </div>
        </motion.div>
      ))}
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-slate-900 font-semibold">Staff Directory</h3>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-slate-900 rounded-xl text-sm font-medium transition-colors">Add Staff</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-200">
            {['Name', 'Department', 'Designation', 'Login ID', 'Join Date', 'Status'].map(h => (
              <th key={h} className="text-left text-slate-500 text-xs font-medium p-4">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center text-slate-400 text-xs">Loading staff...</td></tr>
            ) : staff.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-slate-400 text-xs">No staff found.</td></tr>
            ) : (
              staff.map(s => (
                <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">{s.name.charAt(0).toUpperCase()}</div>
                      <span className="text-slate-900 text-xs">{s.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 text-xs">{s.department || 'N/A'}</td>
                  <td className="p-4 text-slate-600 text-xs capitalize">{s.role}</td>
                  <td className="p-4 text-slate-600 text-xs font-mono">{s.loginId}</td>
                  <td className="p-4 text-slate-600 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.isActive ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {s.isActive ? 'Active' : 'On Leave'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  </div>
  );
};

export default HRDPage;
