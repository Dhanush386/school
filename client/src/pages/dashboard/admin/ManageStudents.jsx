import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdPeople, MdAdd, MdClose, MdPayment, MdCheckCircle, MdSchool, MdWarning, MdDelete } from 'react-icons/md';
import api from '../../../api/axiosInstance';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAssignFee, setShowAssignFee] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form states
  const [studentForm, setStudentForm] = useState({ name: '', loginId: '', department: '', role: 'student', section: 'A' });
  const [feeForm, setFeeForm] = useState({ feeType: 'Tuition Fee', amount: '', dueDate: '', academicYear: '2024-2025' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/users/students?limit=100');
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/users/students', studentForm);
      if (data.success) {
        toast.success(data.message);
        setShowAddStudent(false);
        setStudentForm({ name: '', loginId: '', department: '', role: 'student', section: 'A' });
        fetchStudents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating student');
    }
  };

  const handleAssignFee = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/fees', {
        student: selectedStudent._id,
        feeType: feeForm.feeType,
        amount: Number(feeForm.amount),
        dueDate: feeForm.dueDate,
        academicYear: feeForm.academicYear,
      });
      if (data.success) {
        toast.success('Fee assigned successfully!');
        setShowAssignFee(false);
        setFeeForm({ feeType: 'Tuition Fee', amount: '', dueDate: '', academicYear: '2024-2025' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error assigning fee');
    }
  };

  const openAssignFee = (student) => {
    setSelectedStudent(student);
    setShowAssignFee(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? All their fees and data will be lost.')) return;
    try {
      const { data } = await api.delete(`/users/students/${userId}`);
      if (data.success) {
        toast.success(data.message);
        fetchStudents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting user');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MdPeople className="text-primary-500" /> Manage Users
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create student and teacher accounts</p>
        </div>
        <button
          onClick={() => setShowAddStudent(true)}
          className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary-600/30"
        >
          <MdAdd size={20} /> Add User
        </button>
      </motion.div>

      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Registered Students</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <MdPeople size={32} />
            </div>
            <h3 className="text-slate-900 font-semibold mb-1">No students found</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-6">
              You haven't added any students to the database yet. Click the "Add Student" button to create your first student.
            </p>
            <button
              onClick={() => setShowAddStudent(true)}
              className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Add Student Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-5 py-4 font-medium text-slate-500">Name</th>
                  <th className="px-5 py-4 font-medium text-slate-500">Login ID</th>
                  <th className="px-5 py-4 font-medium text-slate-500">Role</th>
                  <th className="px-5 py-4 font-medium text-slate-500">Dept & Sec</th>
                  <th className="px-5 py-4 font-medium text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${student.role === 'teacher' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-primary-400 to-indigo-500'}`}>
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-600">{student.loginId}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${student.role === 'teacher' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {student.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{student.department} - {student.section || 'A'}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {student.role === 'student' && (
                          <button
                            onClick={() => openAssignFee(student)}
                            className="bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                          >
                            <MdPayment size={14} /> Assign Fee
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(student._id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                        >
                          <MdDelete size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ADD STUDENT MODAL */}
      <AnimatePresence>
        {showAddStudent && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <MdSchool className="text-primary-500" /> Create New User
                </h3>
                <button onClick={() => setShowAddStudent(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                  <MdClose size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateStudent} className="p-5">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Role</label>
                      <select
                        value={studentForm.role}
                        onChange={(e) => setStudentForm({ ...studentForm, role: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Section</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. A"
                        value={studentForm.section}
                        onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Verma"
                      value={studentForm.name}
                      onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Login ID / Roll Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SCH2024012"
                      value={studentForm.loginId}
                      onChange={(e) => setStudentForm({ ...studentForm, loginId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                    <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                      <MdCheckCircle className="text-green-500" /> They will log in using this ID.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Department / Class</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 12-A or CSE"
                      value={studentForm.department}
                      onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                    <MdWarning className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      The default password will automatically be set to <strong>password123</strong>. The student will be forced to change it on their first login.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddStudent(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg shadow-sm">
                    Create User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ASSIGN FEE MODAL */}
      <AnimatePresence>
        {showAssignFee && selectedStudent && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <MdPayment className="text-amber-500" /> Assign Fee
                </h3>
                <button onClick={() => setShowAssignFee(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                  <MdClose size={20} />
                </button>
              </div>
              
              <div className="px-5 pt-4">
                <p className="text-sm text-slate-600">Assigning fee to <strong>{selectedStudent.name}</strong> ({selectedStudent.loginId})</p>
              </div>

              <form onSubmit={handleAssignFee} className="p-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Fee Type</label>
                    <select
                      value={feeForm.feeType}
                      onChange={(e) => setFeeForm({ ...feeForm, feeType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                    >
                      <option value="Tuition Fee">Tuition Fee</option>
                      <option value="Lab Fee">Lab Fee</option>
                      <option value="Library Fee">Library Fee</option>
                      <option value="Transport Fee">Transport Fee</option>
                      <option value="Hostel Fee">Hostel Fee</option>
                      <option value="Sports Fee">Sports Fee</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 15000"
                      value={feeForm.amount}
                      onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Due Date</label>
                    <input
                      type="date"
                      required
                      value={feeForm.dueDate}
                      onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAssignFee(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium rounded-lg shadow-sm">
                    Assign Fee
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
