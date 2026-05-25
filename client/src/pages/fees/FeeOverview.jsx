import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdPayment, MdReceipt, MdDownload, MdClose, MdCheckCircle, MdCreditCard,
  MdAccountBalance, MdQrCode2, MdWarning, MdHome, MdExpandMore, MdExpandLess,
} from "react-icons/md";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const STUDENT = { name: "Rahul Verma", class: "12-A", rollNo: "SCH2024012", id: "STU001" };

const FEE_DATA = [
  { id: 1, type: "Tuition Fee", amount: 15000, due: "2026-06-01", status: "pending" },
  { id: 2, type: "Lab Fee",     amount: 2500,  due: "2026-06-01", status: "pending" },
  { id: 3, type: "Library Fee", amount: 1000,  due: "2026-05-01", status: "overdue" },
  { id: 4, type: "Sports Fee",  amount: 500,   due: "2026-04-01", status: "paid" },
  { id: 5, type: "Transport Fee", amount: 3000, due: "2026-04-01", status: "paid" },
];

const PAYMENT_HISTORY = [
  { id: "TXN202605001", date: "2026-04-02", amount: 3500, method: "UPI", receipt: "RCP001" },
  { id: "TXN202603002", date: "2026-03-01", amount: 15000, method: "Net Banking", receipt: "RCP002" },
  { id: "TXN202601003", date: "2026-01-05", amount: 2500, method: "Card", receipt: "RCP003" },
];

const STATUS_STYLE = {
  paid:    { cls: "bg-green-500/20 text-green-300 border border-green-500/30", label: "Paid" },
  pending: { cls: "bg-amber-500/20 text-amber-300 border border-amber-500/30", label: "Pending" },
  overdue: { cls: "bg-red-500/20 text-red-300 border border-red-500/30", label: "Overdue" },
};

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI / QR Code", icon: <MdQrCode2 size={22} /> },
  { id: "card", label: "Debit / Credit Card", icon: <MdCreditCard size={22} /> },
  { id: "netbanking", label: "Net Banking", icon: <MdAccountBalance size={22} /> },
];

function SummaryCard({ label, value, sub, color }) {
  return (
    <div className={`rounded-2xl p-5 border border-white/5 bg-slate-800/80 border-l-4 ${color}`}>
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">₹{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function FeeOverview() {
  const [showPayModal, setShowPayModal] = useState(false);
  const [payingFee, setPayingFee] = useState(null);
  const [method, setMethod] = useState("upi");
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [upiId, setUpiId] = useState("");
  const [paySuccess, setPaySuccess] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");
  const [historyOpen, setHistoryOpen] = useState(true);

  const totalDue = FEE_DATA.filter(f => f.status !== "paid").reduce((s, f) => s + f.amount, 0);
  const totalPaid = FEE_DATA.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0);
  const nextDue = FEE_DATA.filter(f => f.status === "pending").sort((a, b) => new Date(a.due) - new Date(b.due))[0]?.due || "N/A";

  const openPay = (fee) => { setPayingFee(fee); setPaySuccess(false); setMethod("upi"); setShowPayModal(true); };

  const handlePay = () => {
    const rcp = "RCP" + Date.now().toString().slice(-6);
    setReceiptNo(rcp);
    setPaySuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <MdHome size={14} /> <span>Fees</span> <span>/</span>
              <span className="text-slate-300">Fee Overview</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><MdPayment className="text-primary-400" /> Fee Overview</h1>
            <p className="text-slate-400 text-sm mt-1">{STUDENT.name} · {STUDENT.class} · Roll: {STUDENT.rollNo}</p>
          </div>
          <button onClick={() => openPay(null)}
            className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <MdPayment size={18} /> Pay Now
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <SummaryCard label="Total Due" value={totalDue} sub="Includes overdue" color="border-red-500" />
          <SummaryCard label="Total Paid" value={totalPaid} sub="This academic year" color="border-green-500" />
          <div className="rounded-2xl p-5 border border-white/5 bg-slate-800/80 border-l-4 border-amber-500">
            <p className="text-slate-400 text-xs mb-1">Next Due Date</p>
            <p className="text-2xl font-bold text-white">{nextDue}</p>
            <p className="text-xs text-slate-500 mt-1">Mark your calendar</p>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="rounded-2xl border border-white/5 bg-slate-800/80 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Fee Breakdown</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                {["Fee Type", "Amount", "Due Date", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEE_DATA.map((fee, i) => (
                <tr key={fee.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? "bg-slate-900/30" : ""}`}>
                  <td className="px-4 py-3 font-medium text-white">{fee.type}</td>
                  <td className="px-4 py-3 text-slate-200">₹{fee.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-400">
                    <span className="flex items-center gap-1">
                      {fee.status === "overdue" && <MdWarning size={14} className="text-red-400" />}
                      {fee.due}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[fee.status].cls}`}>
                      {STATUS_STYLE[fee.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {fee.status !== "paid" ? (
                      <button onClick={() => openPay(fee)}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                        <MdPayment size={14} /> Pay
                      </button>
                    ) : (
                      <button className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded-lg text-xs flex items-center gap-1">
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
        <div className="rounded-2xl border border-white/5 bg-slate-800/80 overflow-hidden">
          <button className="w-full px-5 py-4 flex items-center justify-between" onClick={() => setHistoryOpen(o => !o)}>
            <h2 className="text-white font-semibold flex items-center gap-2"><MdReceipt className="text-primary-400" /> Payment History</h2>
            {historyOpen ? <MdExpandLess className="text-slate-400" /> : <MdExpandMore className="text-slate-400" />}
          </button>
          <AnimatePresence>
            {historyOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                      {["Transaction ID", "Date", "Amount", "Method", "Receipt"].map(h => (
                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PAYMENT_HISTORY.map((tx, i) => (
                      <tr key={tx.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? "bg-slate-900/30" : ""}`}>
                        <td className="px-4 py-3 font-mono text-xs text-slate-300">{tx.id}</td>
                        <td className="px-4 py-3 text-slate-300">{tx.date}</td>
                        <td className="px-4 py-3 text-white font-medium">₹{tx.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-400">{tx.method}</td>
                        <td className="px-4 py-3">
                          <button className="text-primary-400 hover:text-primary-300 text-xs flex items-center gap-1 underline underline-offset-2">
                            <MdDownload size={14} /> {tx.receipt}
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md">
              {!paySuccess ? (
                <>
                  <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Make Payment</h3>
                    <button onClick={() => setShowPayModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400"><MdClose size={20} /></button>
                  </div>
                  <div className="p-5 space-y-5">
                    <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-xs">{payingFee ? payingFee.type : "Total Outstanding"}</p>
                        <p className="text-2xl font-bold text-white">₹{payingFee ? payingFee.amount.toLocaleString() : totalDue.toLocaleString()}</p>
                      </div>
                      <MdPayment size={32} className="text-primary-400 opacity-60" />
                    </div>

                    {/* Method Selection */}
                    <div>
                      <p className="text-xs text-slate-400 mb-2">Payment Method</p>
                      <div className="grid grid-cols-3 gap-2">
                        {PAYMENT_METHODS.map(m => (
                          <button key={m.id} onClick={() => setMethod(m.id)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs transition-all ${method === m.id ? "border-primary-500 bg-primary-500/10 text-white" : "border-white/10 bg-slate-800 text-slate-400 hover:border-white/20"}`}>
                            {m.icon} {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Method Details */}
                    {method === "upi" && (
                      <div className="space-y-3">
                        <div className="bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2">
                          <MdQrCode2 size={80} className="text-white opacity-70" />
                          <p className="text-xs text-slate-400">Scan QR to pay via any UPI app</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">Or enter UPI ID</label>
                          <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi"
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500" />
                        </div>
                      </div>
                    )}
                    {method === "card" && (
                      <div className="space-y-3">
                        {[["Card Number", "number", "1234 5678 9012 3456"], ["Card Holder Name", "name", "RAHUL VERMA"], ["Expiry (MM/YY)", "expiry", "12/28"], ["CVV", "cvv", "•••"]].map(([label, key, ph]) => (
                          <div key={key}>
                            <label className="text-xs text-slate-400 mb-1 block">{label}</label>
                            <input type={key === "cvv" ? "password" : "text"} value={cardData[key]} onChange={e => setCardData(d => ({ ...d, [key]: e.target.value }))}
                              placeholder={ph} className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500" />
                          </div>
                        ))}
                      </div>
                    )}
                    {method === "netbanking" && (
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Select Bank</label>
                        <select className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                          {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra"].map(b => <option key={b}>{b}</option>)}
                        </select>
                        <p className="text-xs text-slate-500 mt-2">You will be redirected to your bank's secure page.</p>
                      </div>
                    )}
                  </div>
                  <div className="p-5 border-t border-white/10">
                    <button onClick={handlePay} className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl font-medium text-sm transition-all">
                      Pay ₹{payingFee ? payingFee.amount.toLocaleString() : totalDue.toLocaleString()}
                    </button>
                  </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-8 flex flex-col items-center text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
                    <MdCheckCircle size={72} className="text-green-400 mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-1">Payment Successful!</h3>
                  <p className="text-slate-400 text-sm mb-4">Your payment has been processed successfully.</p>
                  <div className="bg-slate-800 rounded-xl px-6 py-3 mb-6">
                    <p className="text-xs text-slate-500">Receipt Number</p>
                    <p className="text-lg font-mono font-bold text-primary-400">{receiptNo}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                      <MdDownload size={16} /> Download Receipt
                    </button>
                    <button onClick={() => setShowPayModal(false)} className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl text-sm">Done</button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
