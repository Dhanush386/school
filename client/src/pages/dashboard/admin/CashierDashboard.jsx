import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSearch, MdPayment, MdCheckCircle, MdMoney, MdPrint } from 'react-icons/md';
import api from '../../../api/axiosInstance';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const CashierDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState([]);
  const [searched, setSearched] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  
  // Bulk Assign State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkForm, setBulkForm] = useState({
    department: '',
    feeType: '',
    amount: '',
    dueDate: '',
    academicYear: '',
    semester: ''
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Admin fees endpoint with search filter
      const res = await api.get(`/fees?search=${searchQuery}`);
      // Filter out paid fees so we only show pending/overdue
      const unpaidFees = (res.data.data || []).filter(f => f.status !== 'paid');
      setFees(unpaidFees);
      setSearched(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to search fees');
    } finally {
      setLoading(false);
    }
  };

  const processCashPayment = async (feeId) => {
    if (!window.confirm('Confirm receiving cash payment for this fee?')) return;

    setProcessingId(feeId);
    try {
      const res = await api.post(`/fees/${feeId}/pay`, { paymentMethod: 'cash' });
      toast.success(res.data.message || 'Payment collected successfully');
      
      // Update local state to remove the paid fee
      setFees(prev => prev.filter(f => f._id !== feeId));
      
      // Optional: automatically trigger receipt download
      if (res.data.data?.receiptFilename) {
        toast.success('Receipt generated');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process payment');
    } finally {
      setProcessingId(null);
    }
  };

  const downloadReceipt = async (feeId, filename) => {
    try {
      const res = await api.get(`/fees/${feeId}/receipt`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || `receipt-${feeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setBulkLoading(true);
    try {
      const payload = {
        ...bulkForm,
        amount: Number(bulkForm.amount),
        semester: bulkForm.semester ? Number(bulkForm.semester) : null,
      };
      const res = await api.post('/fees/bulk', payload);
      
      toast.success(
        <div>
          <p className="font-bold">Successfully assigned {payload.feeType} (₹{payload.amount})</p>
          <p>to {res.data.assigned} students in Class {payload.department}.</p>
          {res.data.skipped > 0 && <p className="text-amber-500 text-xs mt-1">{res.data.skipped} students were skipped because fees already existed.</p>}
        </div>
      );
      
      setIsBulkModalOpen(false);
      setBulkForm({
        department: '', feeType: '', amount: '', dueDate: '', academicYear: '', semester: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to bulk assign fees');
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="relative rounded-3xl p-6 overflow-hidden bg-white border border-slate-200"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-slate-900 text-2xl font-bold">Cashier Desk</h1>
            <p className="text-slate-500 text-sm mt-1">Collect offline payments and generate receipts.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-600/20 text-sm"
            >
              Bulk Assign Fees
            </button>
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl shadow-sm border border-green-100">
              <MdMoney />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.form
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        onSubmit={handleSearch}
        className="flex gap-4"
      >
        <div className="flex-1 relative">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            placeholder="Search student by Roll Number (e.g. STU001) or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-slate-700"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold transition-colors disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-primary-600/20"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Search <MdSearch /></>
          )}
        </button>
      </motion.form>

      {/* Results */}
      <AnimatePresence mode="wait">
        {searched && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Pending Fees</h3>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {fees.length} records found
              </span>
            </div>

            {fees.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <MdCheckCircle className="text-4xl text-green-400 mx-auto mb-3" />
                <p>No pending fees found for this query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Student</th>
                      <th className="p-4 font-semibold">Fee Type</th>
                      <th className="p-4 font-semibold">Amount</th>
                      <th className="p-4 font-semibold">Due Date</th>
                      <th className="p-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {fees.map((fee) => (
                      <tr key={fee._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">{fee.student?.name}</div>
                          <div className="text-slate-500 text-xs">{fee.student?.loginId} • {fee.student?.department}</div>
                        </td>
                        <td className="p-4">
                          <span className="capitalize font-medium text-slate-700">{fee.feeType}</span>
                          <div className="text-slate-500 text-xs">AY {fee.academicYear}</div>
                        </td>
                        <td className="p-4 font-bold text-slate-900">
                          ₹{fee.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 text-slate-600">
                          {new Date(fee.dueDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => processCashPayment(fee._id)}
                            disabled={processingId === fee._id}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-70 shadow-md shadow-green-500/20"
                          >
                            {processingId === fee._id ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>Collect Cash <MdPayment /></>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Assign Modal */}
      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Bulk Assign Fees</h2>
                <p className="text-sm text-slate-500 mt-1">Assign fees to all students in a specific class.</p>
              </div>
              <form onSubmit={handleBulkSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Class *</label>
                    <select required value={bulkForm.department} onChange={e => setBulkForm({...bulkForm, department: e.target.value})} className="w-full p-2 border rounded-xl outline-none focus:border-indigo-500 text-sm">
                      <option value="">Select Class</option>
                      <option value="X">Class X</option>
                      <option value="XI">Class XI</option>
                      <option value="XII">Class XII</option>
                      <option value="IX">Class IX</option>
                      <option value="VIII">Class VIII</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Type *</label>
                    <select required value={bulkForm.feeType} onChange={e => setBulkForm({...bulkForm, feeType: e.target.value})} className="w-full p-2 border rounded-xl outline-none focus:border-indigo-500 text-sm">
                      <option value="">Select Fee Type</option>
                      <option value="Tuition Fee">Tuition Fee</option>
                      <option value="Hostel Fee">Hostel Fee</option>
                      <option value="Transport Fee">Transport Fee</option>
                      <option value="Exam Fee">Exam Fee</option>
                      <option value="Library Fee">Library Fee</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                    <input type="number" min="1" required value={bulkForm.amount} onChange={e => setBulkForm({...bulkForm, amount: e.target.value})} className="w-full p-2 border rounded-xl outline-none focus:border-indigo-500 text-sm" placeholder="e.g. 50000" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date *</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} required value={bulkForm.dueDate} onChange={e => setBulkForm({...bulkForm, dueDate: e.target.value})} className="w-full p-2 border rounded-xl outline-none focus:border-indigo-500 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year *</label>
                    <input type="text" pattern="^\d{4}-\d{2}$" title="Format: YYYY-YY (e.g. 2024-25)" required value={bulkForm.academicYear} onChange={e => setBulkForm({...bulkForm, academicYear: e.target.value})} className="w-full p-2 border rounded-xl outline-none focus:border-indigo-500 text-sm" placeholder="2024-25" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Semester *</label>
                    <input type="number" min="1" max="8" required value={bulkForm.semester} onChange={e => setBulkForm({...bulkForm, semester: e.target.value})} className="w-full p-2 border rounded-xl outline-none focus:border-indigo-500 text-sm" placeholder="e.g. 1" />
                  </div>
                </div>
                
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-4">
                  <button type="button" onClick={() => setIsBulkModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={bulkLoading} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-indigo-600/20">
                    {bulkLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Assign to Class'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CashierDashboard;
