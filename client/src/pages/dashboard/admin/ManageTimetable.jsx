import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdSchedule, MdSave, MdRefresh } from 'react-icons/md';
import api from '../../../api/axiosInstance';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const slots = ['08:30-09:30', '09:30-10:30', '10:30-11:30', '11:30-12:30', '01:30-02:30', '02:30-03:30', '03:30-04:30'];

const emptySchedule = () => ({
  Monday: Array(7).fill(''),
  Tuesday: Array(7).fill(''),
  Wednesday: Array(7).fill(''),
  Thursday: Array(7).fill(''),
  Friday: Array(7).fill(''),
});

export default function ManageTimetable() {
  const [classFilter, setClassFilter] = useState('10');
  const [sectionFilter, setSectionFilter] = useState('A');
  const [schedule, setSchedule] = useState(emptySchedule());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTimetable();
  }, [classFilter, sectionFilter]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/timetable?department=${classFilter}&section=${sectionFilter}`);
      if (data.success && data.data) {
        // Merge with empty to ensure no missing arrays if DB is incomplete
        const dbSchedule = data.data.schedule;
        const merged = emptySchedule();
        days.forEach(d => {
          if (dbSchedule[d]) {
            for (let i = 0; i < 7; i++) {
              merged[d][i] = dbSchedule[d][i] || '';
            }
          }
        });
        setSchedule(merged);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No timetable exists for this class/section yet
        setSchedule(emptySchedule());
      } else {
        toast.error('Failed to load timetable');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (day, slotIndex, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].map((sub, i) => (i === slotIndex ? value : sub))
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.post('/timetable', {
        department: classFilter,
        section: sectionFilter,
        schedule
      });
      if (data.success) {
        toast.success('Timetable saved successfully!');
      }
    } catch (error) {
      toast.error('Failed to save timetable');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MdSchedule className="text-primary-500" /> Manage Timetables
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create and update class schedules</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary-600/30 disabled:opacity-60"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MdSave size={20} />}
          Save Timetable
        </button>
      </motion.div>

      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>Class {i + 1}</option>
              ))}
            </select>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500"
            >
              {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>Section {s}</option>)}
            </select>
          </div>
          <button onClick={fetchTimetable} className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <MdRefresh /> Reload
          </button>
        </div>
        
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-500">Loading schedule...</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-5">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-3 text-left text-slate-500 font-medium border-b border-slate-200 w-32">Time / Day</th>
                  {slots.map(slot => (
                    <th key={slot} className="p-3 text-center text-slate-700 font-semibold border-b border-slate-200 min-w-[120px] whitespace-nowrap">
                      {slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {days.map(day => (
                  <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-medium text-slate-900 border-r border-slate-100">{day}</td>
                    {slots.map((slot, i) => (
                      <td key={slot} className="p-2 border-r border-slate-100 last:border-0">
                        <input
                          type="text"
                          placeholder="Subject/Break"
                          value={schedule[day][i]}
                          onChange={(e) => handleSubjectChange(day, i, e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-300"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
