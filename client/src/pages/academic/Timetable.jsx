import { motion } from 'framer-motion';
import { MdSchedule } from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const slots = ['08:30-09:30', '09:30-10:30', '10:30-11:30', '11:30-12:30', '01:30-02:30', '02:30-03:30', '03:30-04:30'];

const timetable = {
  Monday:    ['', '', '', '', '', '', ''],
  Tuesday:   ['', '', '', '', '', '', ''],
  Wednesday: ['', '', '', '', '', '', ''],
  Thursday:  ['', '', '', '', '', '', ''],
  Friday:    ['', '', '', '', '', '', ''],
};

const colors = {
  'Mathematics': 'bg-blue-500/20 text-blue-300 border-blue-500/20',
  'Science': 'bg-violet-500/20 text-violet-300 border-violet-500/20',
  'English': 'bg-green-500/20 text-green-300 border-green-500/20',
  'History': 'bg-amber-500/20 text-amber-300 border-amber-500/20',
  'Geography': 'bg-pink-500/20 text-pink-300 border-pink-500/20',
  'Art': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/20',
  'Physical Ed': 'bg-orange-500/20 text-orange-300 border-orange-500/20',
  'Computer Sci': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/20',
  'Break': 'bg-white/3 text-slate-600 border-transparent',
};

const Timetable = () => {
  const { user } = useAuth();
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const academicYear = currentMonth < 5 
    ? `${currentYear - 1}-${String(currentYear).slice(2)}` 
    : `${currentYear}-${String(currentYear + 1).slice(2)}`;

  return (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-slate-900 text-2xl font-bold">Class Timetable</h1>
      <p className="text-slate-500 text-sm mt-1">Academic Year {academicYear} · {user?.department || 'General'} Department</p>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="rounded-2xl border border-slate-200 overflow-hidden" style={{ background: 'rgba(255,255,255,1)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left text-slate-500 text-xs font-medium p-4 w-28">Time</th>
              {days.map(d => <th key={d} className="text-center text-slate-700 text-xs font-semibold p-4">{d}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {slots.map((slot, si) => (
              <tr key={slot} className="hover:bg-white/2 transition-colors">
                <td className="p-4 text-slate-500 text-xs font-mono whitespace-nowrap">{slot}</td>
                {days.map(day => {
                  const subject = timetable[day][si] || '';
                  const cls = colors[subject] || 'bg-transparent text-slate-600 border-transparent';
                  return (
                    <td key={day} className="p-2 text-center">
                      {subject ? (
                        <div className={`px-2 py-1.5 rounded-xl border text-xs font-medium ${cls} transition-all hover:scale-105`}>
                          {subject}
                        </div>
                      ) : <div className="text-slate-700 text-xs">—</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
    <div className="flex flex-wrap gap-2">
      {Object.entries(colors).filter(([k]) => k !== 'Break').map(([subject, cls]) => (
        <div key={subject} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs ${cls}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current" />{subject}
        </div>
      ))}
    </div>
  </div>
  );
};

export default Timetable;
