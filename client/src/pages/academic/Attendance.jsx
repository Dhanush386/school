import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdCheckCircle, MdCancel, MdAccessTime } from 'react-icons/md';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { fadeInUp } from '../../animations/fadeIn';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { attendanceService, userService } from '../../services/moduleServices';

const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Sci'];

const Attendance = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  
  // Student State
  const [myAttendance, setMyAttendance] = useState([]);
  const [subjectStats, setSubjectStats] = useState([]);
  const [summary, setSummary] = useState({ total: 0, present: 0, overallPercentage: '0.00' });
  
  // Teacher State
  const [students, setStudents] = useState([]);
  const [marking, setMarking] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (isTeacher) {
          const res = await userService.getStudents();
          setStudents(res.data?.data || []);
        } else {
          const res = await attendanceService.getMy();
          setMyAttendance(res.data?.data || []);
          setSubjectStats(res.data?.subjectStats || []);
          setSummary(res.data?.summary || { total: 0, present: 0, overallPercentage: '0.00' });
        }
      } catch (err) {
        console.error('Failed to fetch attendance data', err);
        toast.error('Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isTeacher]);

  const handleMark = (studentId, status) => setMarking(prev => ({ ...prev, [studentId]: status }));

  const handleSave = async () => {
    try {
      const records = Object.entries(marking).map(([studentId, status]) => ({ studentId, status }));
      if (records.length === 0) return toast.error('No attendance marked');
      
      await attendanceService.mark({
        date: new Date().toISOString(),
        subject: selectedSubject,
        className: '12-A', // In a real app this would be dynamic
        department: user?.department || 'CS',
        records
      });
      toast.success('Attendance saved successfully!');
      setMarking({});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save attendance');
    }
  };

  const pieData = [
    { name: 'Present', value: Number(summary.overallPercentage), color: '#10b981' },
    { name: 'Absent/Late', value: 100 - Number(summary.overallPercentage), color: '#ef4444' },
  ];

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading attendance...</div>;
  }

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
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-slate-500 text-xs">Overall</span>
                  <span className="text-slate-900 text-xs font-bold ml-auto">{summary.overallPercentage}%</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{summary.present} present out of {summary.total} classes</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} className="rounded-2xl p-5 border border-slate-200" style={{ background: 'rgba(255,255,255,1)' }}>
            <h3 className="text-slate-900 font-semibold mb-4">Subject-wise</h3>
            <div className="space-y-3">
              {subjectStats.length === 0 ? <p className="text-xs text-slate-500">No subject data available.</p> : subjectStats.map(s => {
                const pct = Number(s.attendancePercentage);
                return (
                  <div key={s.subject}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 truncate max-w-[60%]">{s.subject}</span>
                      <span className={`font-bold ${pct < 75 ? 'text-red-400' : pct < 85 ? 'text-amber-400' : 'text-green-400'}`}>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3, duration: 0.8 }}
                        className={`h-full rounded-full ${pct < 75 ? 'bg-red-500' : pct < 85 ? 'bg-amber-500' : 'bg-green-500'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} className="lg:col-span-2 rounded-2xl border border-slate-200 overflow-hidden" style={{ background: 'rgba(255,255,255,1)' }}>
            <div className="p-5 border-b border-slate-200"><h3 className="text-slate-900 font-semibold">Recent Attendance</h3></div>
            <div className="divide-y divide-slate-200">
              {myAttendance.length === 0 ? <p className="p-5 text-sm text-slate-500 text-center">No recent attendance records found.</p> : myAttendance.map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.status === 'present' ? 'bg-green-500/20 text-green-400' : a.status === 'absent' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {a.status === 'present' ? <MdCheckCircle /> : a.status === 'absent' ? <MdCancel /> : <MdAccessTime />}
                  </div>
                  <div className="flex-1"><p className="text-slate-900 text-sm font-medium">{a.subject}</p><p className="text-slate-500 text-xs">{new Date(a.date).toLocaleDateString()}</p></div>
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
              <button key={s} onClick={() => { setSelectedSubject(s); setMarking({}); }}
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
                  <p className="text-slate-500 text-xs mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-slate-900 rounded-xl text-sm font-medium transition-colors">Save Attendance</button>
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {students.length === 0 ? <p className="p-5 text-sm text-slate-500 text-center">No students found.</p> : students.map(student => {
                const status = marking[student._id];
                return (
                  <div key={student._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-slate-900 text-xs font-bold">{student.name.charAt(0)}</div>
                      <div>
                        <span className="text-slate-900 text-sm block">{student.name}</span>
                        <span className="text-slate-400 text-xs">{student.loginId}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[['present', 'P', 'bg-green-600/20 text-green-400 hover:bg-green-600/40', 'bg-green-600 text-slate-900'],
                        ['absent', 'A', 'bg-red-600/20 text-red-400 hover:bg-red-600/40', 'bg-red-600 text-slate-900'],
                        ['late', 'L', 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/40', 'bg-amber-600 text-slate-900']].map(([val, label, base, active]) => (
                        <button key={val} onClick={() => handleMark(student._id, val)}
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
