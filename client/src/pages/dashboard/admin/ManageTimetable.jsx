import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdSchedule, MdSave, MdRefresh, MdDelete, MdAdd } from 'react-icons/md';
import api from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import { CLASSES_LIST, SECTIONS_LIST } from '../../../constants/academic';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const defaultSlots = ['08:30-09:30', '09:30-10:30', '10:30-11:30', '11:30-12:30', '01:30-02:30', '02:30-03:30', '03:30-04:30'];

const emptySchedule = (numSlots = 7) => ({
  Monday: Array(numSlots).fill(''),
  Tuesday: Array(numSlots).fill(''),
  Wednesday: Array(numSlots).fill(''),
  Thursday: Array(numSlots).fill(''),
  Friday: Array(numSlots).fill(''),
});

export default function ManageTimetable() {
  const [classFilter, setClassFilter] = useState('X');
  const [sectionFilter, setSectionFilter] = useState('A');
  const [timeSlots, setTimeSlots] = useState(defaultSlots);
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
        const dbSchedule = data.data.schedule;
        const activeSlots = data.data.timeSlots && data.data.timeSlots.length > 0 ? data.data.timeSlots : defaultSlots;
        setTimeSlots(activeSlots);
        const merged = emptySchedule(activeSlots.length);
        days.forEach(d => {
          if (dbSchedule[d]) {
            for (let i = 0; i < activeSlots.length; i++) {
              merged[d][i] = dbSchedule[d][i] || '';
            }
          }
        });
        setSchedule(merged);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No timetable exists for this class/section yet
        setTimeSlots(defaultSlots);
        setSchedule(emptySchedule(defaultSlots.length));
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

  const handleTimeSlotChange = (index, value) => {
    setTimeSlots(prev => prev.map((slot, i) => (i === index ? value : slot)));
  };

  const handleAddSlot = () => {
    setTimeSlots(prev => [...prev, 'New Slot']);
    setSchedule(prev => {
      const next = { ...prev };
      days.forEach(d => next[d] = [...next[d], '']);
      return next;
    });
  };

  const handleDeleteSlot = (index) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
    setSchedule(prev => {
      const next = { ...prev };
      days.forEach(d => next[d] = next[d].filter((_, i) => i !== index));
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.post('/timetable', {
        department: classFilter,
        section: sectionFilter,
        timeSlots,
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
              {CLASSES_LIST.map((cls) => (
                <option key={cls.value} value={cls.value}>{cls.label}</option>
              ))}
            </select>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500"
            >
              {SECTIONS_LIST.map(s => <option key={s} value={s}>Section {s}</option>)}
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
                  {timeSlots.map((slot, i) => (
                    <th key={i} className="p-3 text-center border-b border-slate-200 min-w-[120px]">
                      <div className="flex items-center gap-1 justify-center">
                        <input
                          type="text"
                          value={slot}
                          onChange={(e) => handleTimeSlotChange(i, e.target.value)}
                          className="bg-transparent border-b border-dashed border-slate-300 text-slate-700 font-semibold text-center w-24 focus:outline-none focus:border-primary-500"
                        />
                        <button onClick={() => handleDeleteSlot(i)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Delete slot">
                          <MdDelete />
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="p-3 text-center border-b border-slate-200 w-16">
                    <button onClick={handleAddSlot} className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-1.5 rounded-full transition-colors mx-auto flex items-center justify-center" title="Add time slot">
                      <MdAdd size={16} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {days.map(day => (
                  <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-medium text-slate-900 border-r border-slate-100">{day}</td>
                    {timeSlots.map((slot, i) => (
                      <td key={i} className="p-2 border-r border-slate-100">
                        <input
                          type="text"
                          placeholder="Subject/Break"
                          value={schedule[day][i]}
                          onChange={(e) => handleSubjectChange(day, i, e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-300"
                        />
                      </td>
                    ))}
                    <td className="p-2 border-slate-100"></td>
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
