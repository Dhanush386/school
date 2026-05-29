import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdPayment, MdReceipt, MdDownload, MdClose, MdCheckCircle, MdCreditCard,
  MdAccountBalance, MdQrCode2, MdWarning, MdHome, MdExpandMore, MdExpandLess,
} from "react-icons/md";
import { useAuth } from '../../context/AuthContext';
import { feesService } from '../../services/moduleServices';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const STATUS_STYLE = {
  paid:    { cls: "bg-green-500/10 text-green-600 border border-green-500/20", label: "Paid" },
  pending: { cls: "bg-amber-500/10 text-amber-600 border border-amber-500/20", label: "Pending" },
  overdue: { cls: "bg-red-500/10 text-red-600 border border-red-500/20", label: "Overdue" },
};

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI / QR Code", icon: <MdQrCode2 size={22} /> },
  { id: "card", label: "Debit / Credit Card", icon: <MdCreditCard size={22} /> },
  { id: "netbanking", label: "Net Banking", icon: <MdAccountBalance size={22} /> },
];

function SummaryCard({ label, value, sub, color }) {
  return (
    <div className={`rounded-2xl p-5 border border-slate-200 bg-white border-l-4 ${color}`}>
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">₹{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function FeeOverview() {
  const { user } = useAuth();
  
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, totalPaid: 0, totalPending: 0 });
  const [loading, setLoading] = useState(true);

  const [showPayModal, setShowPayModal] = useState(false);
  const [payingFee, setPayingFee] = useState(null);
  const [method, setMethod] = useState("upi");
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [upiId, setUpiId] = useState("");
  const [paySuccess, setPaySuccess] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");
  const [historyOpen, setHistoryOpen] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await feesService.getStudentFees();
      const fetchedFees = res.data?.data || [];
      const fetchedSummary = res.data?.summary || { totalAmount: 0, totalPaid: 0, totalPending: 0 };
      
      setFees(fetchedFees);
      setSummary(fetchedSummary);
    } catch (error) {
      toast.error('Failed to load fees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const openPay = (fee) => {
    if (!fee) return toast.error("Please select a specific fee to pay from the breakdown below.");
    setPayingFee(fee); 
    setPaySuccess(false); 
    setMethod("upi"); 
    setShowPayModal(true); 
  };

  const handlePay = async () => {
    if (!payingFee) return;
    try {
      setProcessing(true);
      const res = await feesService.payFee(payingFee._id, method);
      setReceiptNo(res.data?.data?.receiptNumber || "RCP-SUCCESS");
      setPaySuccess(true);
      fetchFees(); // Refresh data to show paid status
      toast.success("Payment successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadReceipt = async (feeId, rcpNo) => {
    try {
      toast.loading('Generating receipt...', { id: 'receipt' });
      const response = await feesService.downloadReceipt(feeId);
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${rcpNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Downloaded!', { id: 'receipt' });
    } catch (error) {
      toast.error('Failed to download receipt', { id: 'receipt' });
    }
  };

  const nextDue = fees.filter(f => f.status === "pending").sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]?.dueDate || "N/A";
  const paidFees = fees.filter(f => f.status === "paid").sort((a, b) => new Date(b.paymentDate || b.updatedAt) - new Date(a.paymentDate || a.updatedAt));

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center text-slate-500">Loading your fees...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <MdHome size={14} /> <span>Fees</span> <span>/</span>
              <span className="text-slate-700">Fee Overview</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><MdPayment className="text-primary-600" /> Fee Overview</h1>
            <p className="text-slate-500 text-sm mt-1">{user?.name} · {user?.loginId}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <SummaryCard label="Total Due" value={summary.totalPending} sub="Includes overdue" color="border-red-500" />
          <SummaryCard label="Total Paid" value={summary.totalPaid} sub="This academic year" color="border-green-500" />
          <div className="rounded-2xl p-5 border border-slate-200 bg-white border-l-4 border-amber-500">
            <p className="text-slate-500 text-xs mb-1">Next Due Date</p>
            <p className="text-2xl font-bold text-slate-900">{nextDue !== "N/A" ? new Date(nextDue).toLocaleDateString() : "N/A"}</p>
            <p className="text-xs text-slate-400 mt-1">Mark your calendar</p>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="text-slate-900 font-semibold">Fee Breakdown</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                {["Fee Type", "Amount", "Due Date", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 && <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">No fee records found.</td></tr>}
              {fees.map((fee, i) => (
                <tr key={fee._id} className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "bg-slate-50/50" : ""}`}>
                  <td className="px-4 py-3 font-medium text-slate-900 capitalize">{fee.feeType}</td>
                  <td className="px-4 py-3 text-slate-700">₹{fee.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-500">
                    <span className="flex items-center gap-1">
                      {fee.status === "overdue" && <MdWarning size={14} className="text-red-500" />}
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[fee.status]?.cls || STATUS_STYLE.pending.cls}`}>
                      {STATUS_STYLE[fee.status]?.label || "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {fee.status !== "paid" ? (
                      <button onClick={() => openPay(fee)}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                        <MdPayment size={14} /> Pay
                      </button>
                    ) : (
                      <button onClick={() => handleDownloadReceipt(fee._id, fee.receiptNumber)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                        <MdDownload size={14} /> Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment History */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors" onClick={() => setHistoryOpen(o => !o)}>
            <h2 className="text-slate-900 font-semibold flex items-center gap-2"><MdReceipt className="text-primary-600" /> Payment History</h2>
            {historyOpen ? <MdExpandLess className="text-slate-500" /> : <MdExpandMore className="text-slate-500" />}
          </button>
          <AnimatePresence>
            {historyOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                      {["Transaction ID", "Date", "Amount", "Method", "Receipt"].map(h => (
                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paidFees.length === 0 && <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">No payments yet.</td></tr>}
                    {paidFees.map((tx, i) => (
                      <tr key={tx._id} className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "bg-slate-50/50" : ""}`}>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{tx.transactionId || tx._id.slice(-8)}</td>
                        <td className="px-4 py-3 text-slate-600">{new Date(tx.paymentDate || tx.updatedAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-slate-900 font-medium">₹{tx.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-500 capitalize">{tx.paymentMethod || 'online'}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDownloadReceipt(tx._id, tx.receiptNumber)} className="text-primary-600 hover:text-primary-500 text-xs flex items-center gap-1 underline underline-offset-2">
                            <MdDownload size={14} /> {tx.receiptNumber || 'Download'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-xl">
              {!paySuccess ? (
                <>
                  <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Make Payment</h3>
                    <button onClick={() => setShowPayModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><MdClose size={20} /></button>
                  </div>
                  <div className="p-5 space-y-5">
                    <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
                      <div>
                        <p className="text-slate-500 text-xs capitalize">{payingFee?.feeType}</p>
                        <p className="text-2xl font-bold text-slate-900">₹{payingFee?.amount.toLocaleString()}</p>
                      </div>
                      <MdPayment size={32} className="text-primary-500 opacity-60" />
                    </div>

                    {/* Method Selection */}
                    <div>
                      <p className="text-xs text-slate-500 mb-2 font-medium">Payment Method</p>
                      <div className="grid grid-cols-3 gap-2">
                        {PAYMENT_METHODS.map(m => (
                          <button key={m.id} onClick={() => setMethod(m.id)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs transition-all ${method === m.id ? "border-primary-500 bg-primary-50 text-primary-700 font-medium" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"}`}>
                            {m.icon} {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Method Details */}
                    {method === "upi" && (
                      <div className="space-y-3">
                        <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center gap-2 border border-slate-100">
                          <MdQrCode2 size={80} className="text-slate-700 opacity-70" />
                          <p className="text-xs text-slate-500">Scan QR to pay via any UPI app</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block font-medium">Or enter UPI ID</label>
                          <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                        </div>
                      </div>
                    )}
                    {method === "card" && (
                      <div className="space-y-3">
                        {[["Card Number", "number", "1234 5678 9012 3456"], ["Card Holder Name", "name", "RAHUL VERMA"], ["Expiry (MM/YY)", "expiry", "12/28"], ["CVV", "cvv", "•••"]].map(([label, key, ph]) => (
                          <div key={key}>
                            <label className="text-xs text-slate-500 mb-1 block font-medium">{label}</label>
                            <input type={key === "cvv" ? "password" : "text"} value={cardData[key]} onChange={e => setCardData(d => ({ ...d, [key]: e.target.value }))}
                              placeholder={ph} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                          </div>
                        ))}
                      </div>
                    )}
                    {method === "netbanking" && (
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block font-medium">Select Bank</label>
                        <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
                          <option>State Bank of India</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                    <button onClick={handlePay} disabled={processing}
                      className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors shadow-sm">
                      {processing ? "Processing..." : `Pay ₹${payingFee?.amount.toLocaleString()}`}
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 flex flex-col items-center text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <MdCheckCircle size={40} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
                  <p className="text-slate-500 text-sm mb-6">Your payment has been processed securely. The receipt has been generated.</p>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full mb-6">
                    <div className="flex justify-between text-xs text-slate-500 mb-2"><span>Receipt No.</span><span className="text-slate-900 font-medium">{receiptNo}</span></div>
                    <div className="flex justify-between text-xs text-slate-500 mb-2"><span>Amount</span><span className="text-slate-900 font-medium">₹{payingFee?.amount.toLocaleString()}</span></div>
                    <div className="flex justify-between text-xs text-slate-500"><span>Date</span><span className="text-slate-900 font-medium">{new Date().toLocaleString()}</span></div>
                  </div>
                  <button onClick={() => setShowPayModal(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl font-medium transition-colors">Done</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
