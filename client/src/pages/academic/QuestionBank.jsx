import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdAdd, MdVisibility, MdSend, MdDelete, MdClose, MdCheckCircle,
  MdCancel, MdSchool, MdOutlineLibraryBooks,
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const STATUS_BADGE = {
  draft:    "bg-slate-600 text-slate-200",
  pending:  "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  approved: "bg-green-500/20 text-green-300 border border-green-500/30",
  rejected: "bg-red-500/20 text-red-300 border border-red-500/30",
};

const QUESTION_TYPES = ["mcq", "descriptive", "true_false"];

const defaultQuestion = () => ({
  id: Date.now(),
  type: "mcq",
  text: "",
  marks: 2,
  options: ["", "", "", ""],
  correctAnswer: "0",
});

// ─── Teacher View ────────────────────────────────────────────────────────────
function TeacherView() {
  const [tab, setTab] = useState("My Questions");
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [questions, setQuestions] = useState([defaultQuestion()]);
  const [form, setForm] = useState({ title: "", subject: "", className: "", department: "" });
  
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ["My Questions", "Drafts", "Submitted", "Approved"];
  const filterMap = { "My Questions": null, Drafts: "draft", Submitted: "pending", Approved: "approved" };

  useEffect(() => {
    fetchMyPapers();
  }, [tab]);

  const fetchMyPapers = async () => {
    try {
      setLoading(true);
      const status = filterMap[tab];
      const url = status ? `/academic/questions/my?status=${status}` : `/academic/questions/my`;
      const { data } = await axiosInstance.get(url);
      if (data.success) {
        setPapers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch papers", error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => setQuestions(q => [...q, defaultQuestion()]);
  const removeQuestion = (id) => setQuestions(q => q.filter(x => x.id !== id));
  const updateQ = (id, field, val) =>
    setQuestions(q => q.map(x => x.id === id ? { ...x, [field]: val } : x));
  const updateOption = (id, i, val) =>
    setQuestions(q => q.map(x => x.id === id ? { ...x, options: x.options.map((o, idx) => idx === i ? val : o) } : x));

  const handleSaveDraft = async () => {
    try {
      const payload = {
        title: form.title,
        subject: form.subject,
        className: form.className,
        department: form.department,
        questions: questions.map(q => ({
          type: q.type,
          text: q.text,
          marks: q.marks,
          options: q.type === 'mcq' ? q.options : [],
          correctAnswer: q.type === 'mcq' ? q.options[Number(q.correctAnswer)] : q.correctAnswer
        }))
      };
      const { data } = await axiosInstance.post('/academic/questions', payload);
      if (data.success) {
        setShowCreate(false);
        fetchMyPapers();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to create');
    }
  };

  const handleSubmit = async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/academic/questions/${id}/submit`);
      if (data.success) {
        fetchMyPapers();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to submit');
    }
  };

  return (
    <>
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-primary-600 text-slate-900" : "bg-white text-slate-500 hover:text-slate-900"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/80 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              {["Title", "Subject", "Class", "Status", "Created", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : papers.length === 0 ? (
               <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No papers found.</td></tr>
            ) : (
              papers.map((p, i) => (
                <tr key={p._id} className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "bg-slate-50/30" : ""}`}>
                  <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                  <td className="px-4 py-3 text-slate-700">{p.subject}</td>
                  <td className="px-4 py-3 text-slate-700">{p.className}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => setShowDetail(p)} className="p-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors"><MdVisibility size={16} /></button>
                    {p.status === "draft" && <button onClick={() => handleSubmit(p._id)} className="p-1.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 rounded-lg transition-colors"><MdSend size={16} /></button>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-50 rounded-2xl border border-slate-200 w-full max-w-2xl my-8">
              <div className="flex items-center justify-between p-5 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Create Question Paper</h3>
                <button onClick={() => setShowCreate(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><MdClose size={20} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[["Title", "title"], ["Subject", "subject"], ["Class", "className"], ["Department", "department"]].map(([label, key]) => (
                    <div key={key}>
                      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
                      <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-900">Questions</span>
                    <button onClick={addQuestion} className="flex items-center gap-1 text-xs bg-primary-600 hover:bg-primary-500 text-slate-900 px-3 py-1.5 rounded-xl"><MdAdd size={14} /> Add Question</button>
                  </div>
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                    {questions.map((q, qi) => (
                      <div key={q.id} className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-medium text-slate-500">Q{qi + 1}</span>
                          <select value={q.type} onChange={e => updateQ(q.id, "type", e.target.value)}
                            className="bg-slate-700 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none">
                            {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <input type="number" value={q.marks} onChange={e => updateQ(q.id, "marks", e.target.value)}
                            className="w-16 bg-slate-700 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none" placeholder="Marks" />
                          <button onClick={() => removeQuestion(q.id)} className="ml-auto text-red-400 hover:text-red-300"><MdClose size={16} /></button>
                        </div>
                        <textarea value={q.text} onChange={e => updateQ(q.id, "text", e.target.value)} rows={2}
                          placeholder="Question text..." className="w-full bg-slate-700 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none resize-none mb-2" />
                        {q.type === "mcq" && (
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-2">
                                <input type="radio" name={`correct-${q.id}`} checked={q.correctAnswer === String(oi)} onChange={() => updateQ(q.id, "correctAnswer", String(oi))} className="accent-primary-500" />
                                <input value={opt} onChange={e => updateOption(q.id, oi, e.target.value)}
                                  placeholder={`Option ${oi + 1}`} className="flex-1 bg-slate-700 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none" />
                              </div>
                            ))}
                          </div>
                        )}
                        {q.type === "true_false" && (
                          <div className="flex gap-4 text-xs text-slate-700">
                            {["True", "False"].map((opt) => (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name={`tf-${q.id}`} checked={q.correctAnswer === opt} onChange={() => updateQ(q.id, "correctAnswer", opt)} className="accent-primary-500" /> {opt}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end p-5 border-t border-slate-200">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm bg-slate-700 hover:bg-slate-600 text-slate-900">Cancel</button>
                <button onClick={handleSaveDraft} className="bg-primary-600 hover:bg-primary-500 text-slate-900 px-4 py-2 rounded-xl text-sm flex items-center gap-2">Save Draft</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-50 rounded-2xl border border-slate-200 w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{showDetail.title}</h3>
                <button onClick={() => setShowDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><MdClose size={20} /></button>
              </div>
              <div className="space-y-2 text-sm">
                {[["Subject", showDetail.subject], ["Class", showDetail.className], ["Department", showDetail.department], ["Created", new Date(showDetail.createdAt).toLocaleDateString()]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-slate-700 border-b border-slate-200 pb-2">
                    <span className="text-slate-500">{k}</span><span>{v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[showDetail.status]}`}>{showDetail.status}</span>
                </div>
                {showDetail.reviewComment && (
                   <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-xs">
                     <strong>Review Comment:</strong> {showDetail.reviewComment}
                   </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <button onClick={() => setShowCreate(true)}
        className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-500 text-slate-900 p-4 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-medium transition-all">
        <MdAdd size={20} /> Create Paper
      </button>
    </>
  );
}

// ─── Principal View ──────────────────────────────────────────────────────────
function PrincipalView() {
  const [tab, setTab] = useState("Pending Review");
  const [confirm, setConfirm] = useState(null);
  const [comment, setComment] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ["Pending Review", "Approved", "Rejected"];
  const statusMap = { "Pending Review": "pending", Approved: "approved", Rejected: "rejected" };

  useEffect(() => {
    fetchPapers();
  }, [tab]);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/academic/questions?status=${statusMap[tab]}`);
      if (data.success) {
        setPapers(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    try {
      const url = `/academic/questions/${confirm.paper._id}/${confirm.action}`;
      const payload = confirm.action === 'reject' || comment ? { comment } : {};
      
      const { data } = await axiosInstance.patch(url, payload);
      if (data.success) {
        setConfirm(null);
        setComment("");
        fetchPapers();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  return (
    <>
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-primary-600 text-slate-900" : "bg-white text-slate-500 hover:text-slate-900"}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {loading ? (
           <p className="text-center text-slate-500 py-12">Loading papers...</p>
        ) : papers.length === 0 ? (
           <p className="text-center text-slate-500 py-12">No papers in this category.</p>
        ) : (
          papers.map(p => (
            <div key={p._id} className="rounded-2xl p-5 border border-slate-200 bg-white/80">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-slate-900 font-semibold">{p.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{p.createdBy?.name || 'Unknown'} · {p.subject} · Class {p.className}</p>
                  {p.submittedAt && <p className="text-slate-500 text-xs mt-0.5">Submitted: {new Date(p.submittedAt).toLocaleDateString()}</p>}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[p.status]}`}>{p.status}</span>
              </div>
              {tab === "Pending Review" && (
                <div className="mt-4 flex gap-3">
                  <button onClick={() => setConfirm({ paper: p, action: "approve" })}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-slate-900 px-4 py-2 rounded-xl text-sm"><MdCheckCircle size={16} /> Approve</button>
                  <button onClick={() => setConfirm({ paper: p, action: "reject" })}
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-slate-900 px-4 py-2 rounded-xl text-sm"><MdCancel size={16} /> Reject</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-50 rounded-2xl border border-slate-200 w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-1 capitalize">{confirm.action} Paper?</h3>
              <p className="text-slate-500 text-sm mb-4">"{confirm.paper.title}" by {confirm.paper.createdBy?.name}</p>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                placeholder={confirm.action === "reject" ? "Rejection reason (required)" : "Optional comment..."}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none resize-none mb-4" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirm(null)} className="px-4 py-2 rounded-xl text-sm bg-slate-700 hover:bg-slate-600 text-slate-900">Cancel</button>
                <button onClick={handleAction}
                  className={`px-4 py-2 rounded-xl text-sm text-slate-900 ${confirm.action === "approve" ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"}`}>
                  Confirm {confirm.action === "approve" ? "Approve" : "Reject"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function QuestionBank() {
  const { user } = useAuth();
  
  // If user is loading or not available, gracefully handle
  if (!user) return null;

  const role = user.role;
  const isReviewer = ['principal', 'admin', 'coordinator', 'hod'].includes(role);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <MdSchool size={14} /> <span>Academic</span> <span>/</span>
              <span className="text-slate-700">Question Bank</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><MdOutlineLibraryBooks className="text-primary-400" /> Question Bank</h1>
            <p className="text-slate-500 text-sm mt-1">{!isReviewer ? "Manage and submit question papers" : "Review and approve question papers"}</p>
          </div>
        </div>

        {!isReviewer ? <TeacherView /> : <PrincipalView />}
      </motion.div>
    </div>
  );
}
