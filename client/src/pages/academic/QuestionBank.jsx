import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdAdd, MdVisibility, MdSend, MdDelete, MdClose, MdCheckCircle,
  MdCancel, MdExpandMore, MdExpandLess, MdQuestionAnswer, MdSchool,
  MdOutlineLibraryBooks,
} from "react-icons/md";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const useAuth = () => ({ role: "teacher", name: "Mr. Arjun Sharma" });

const STATUS_BADGE = {
  draft:    "bg-slate-600 text-slate-200",
  pending:  "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  approved: "bg-green-500/20 text-green-300 border border-green-500/30",
  rejected: "bg-red-500/20 text-red-300 border border-red-500/30",
};

const mockPapers = [
  { id: 1, title: "Mid-Term Physics Paper", subject: "Physics", class: "12-A", department: "Science", count: 25, status: "approved", date: "2026-05-10", teacher: "Mr. Arjun Sharma", submitted: "2026-05-08" },
  { id: 2, title: "Chemistry Unit Test", subject: "Chemistry", class: "11-B", department: "Science", count: 20, status: "pending", date: "2026-05-15", teacher: "Mr. Arjun Sharma", submitted: "2026-05-14" },
  { id: 3, title: "Math Practice Set", subject: "Mathematics", class: "10-C", department: "Science", count: 30, status: "draft", date: "2026-05-20", teacher: "Mr. Arjun Sharma", submitted: null },
  { id: 4, title: "Biology Final", subject: "Biology", class: "12-B", department: "Science", count: 40, status: "rejected", date: "2026-05-05", teacher: "Ms. Priya Nair", submitted: "2026-05-03" },
  { id: 5, title: "English Grammar Quiz", subject: "English", class: "9-A", department: "Arts", count: 15, status: "pending", date: "2026-05-18", teacher: "Ms. Rekha Iyer", submitted: "2026-05-17" },
];

const QUESTION_TYPES = ["MCQ", "Descriptive", "True/False"];

const defaultQuestion = () => ({
  id: Date.now(),
  type: "MCQ",
  text: "",
  marks: 2,
  options: ["", "", "", ""],
  correct: 0,
});

// ─── Teacher View ────────────────────────────────────────────────────────────
function TeacherView() {
  const [tab, setTab] = useState("My Questions");
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [questions, setQuestions] = useState([defaultQuestion()]);
  const [form, setForm] = useState({ title: "", subject: "", class: "", department: "" });

  const tabs = ["My Questions", "Drafts", "Submitted", "Approved"];
  const filterMap = { "My Questions": null, Drafts: "draft", Submitted: "pending", Approved: "approved" };

  const filtered = mockPapers.filter(p =>
    filterMap[tab] ? p.status === filterMap[tab] : true
  );

  const addQuestion = () => setQuestions(q => [...q, defaultQuestion()]);
  const removeQuestion = (id) => setQuestions(q => q.filter(x => x.id !== id));
  const updateQ = (id, field, val) =>
    setQuestions(q => q.map(x => x.id === id ? { ...x, [field]: val } : x));
  const updateOption = (id, i, val) =>
    setQuestions(q => q.map(x => x.id === id ? { ...x, options: x.options.map((o, idx) => idx === i ? val : o) } : x));

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-primary-600 text-slate-900" : "bg-white text-slate-500 hover:text-slate-900"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              {["Title", "Subject", "Class", "Questions", "Status", "Created", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "bg-slate-50/30" : ""}`}>
                <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                <td className="px-4 py-3 text-slate-700">{p.subject}</td>
                <td className="px-4 py-3 text-slate-700">{p.class}</td>
                <td className="px-4 py-3 text-slate-700">{p.count}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-slate-500">{p.date}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => setShowDetail(p)} className="p-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors"><MdVisibility size={16} /></button>
                  {p.status === "draft" && <button className="p-1.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 rounded-lg transition-colors"><MdSend size={16} /></button>}
                  <button className="p-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"><MdDelete size={16} /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No papers found.</td></tr>
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
                  {[["Title", "title"], ["Subject", "subject"], ["Class", "class"], ["Department", "department"]].map(([label, key]) => (
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
                            {QUESTION_TYPES.map(t => <option key={t}>{t}</option>)}
                          </select>
                          <input type="number" value={q.marks} onChange={e => updateQ(q.id, "marks", e.target.value)}
                            className="w-16 bg-slate-700 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none" placeholder="Marks" />
                          <button onClick={() => removeQuestion(q.id)} className="ml-auto text-red-400 hover:text-red-300"><MdClose size={16} /></button>
                        </div>
                        <textarea value={q.text} onChange={e => updateQ(q.id, "text", e.target.value)} rows={2}
                          placeholder="Question text..." className="w-full bg-slate-700 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none resize-none mb-2" />
                        {q.type === "MCQ" && (
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-2">
                                <input type="radio" checked={q.correct === oi} onChange={() => updateQ(q.id, "correct", oi)} className="accent-primary-500" />
                                <input value={opt} onChange={e => updateOption(q.id, oi, e.target.value)}
                                  placeholder={`Option ${oi + 1}`} className="flex-1 bg-slate-700 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none" />
                              </div>
                            ))}
                          </div>
                        )}
                        {q.type === "True/False" && (
                          <div className="flex gap-4 text-xs text-slate-700">
                            {["True", "False"].map((opt, oi) => (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" checked={q.correct === oi} onChange={() => updateQ(q.id, "correct", oi)} className="accent-primary-500" /> {opt}
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
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm bg-slate-700 hover:bg-slate-600 text-slate-900">Save as Draft</button>
                <button className="bg-primary-600 hover:bg-primary-500 text-slate-900 px-4 py-2 rounded-xl text-sm flex items-center gap-2"><MdSend size={16} /> Submit to Principal</button>
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
                {[["Subject", showDetail.subject], ["Class", showDetail.class], ["Department", showDetail.department], ["Questions", showDetail.count], ["Created", showDetail.date]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-slate-700 border-b border-slate-200 pb-2">
                    <span className="text-slate-500">{k}</span><span>{v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[showDetail.status]}`}>{showDetail.status}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FAB */}
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

  const tabs = ["Pending Review", "Approved", "Rejected"];
  const statusMap = { "Pending Review": "pending", Approved: "approved", Rejected: "rejected" };
  const filtered = mockPapers.filter(p => p.status === statusMap[tab]);

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
        {filtered.map(p => (
          <div key={p.id} className="rounded-2xl p-5 border border-slate-200 bg-white/80">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-slate-900 font-semibold">{p.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{p.teacher} · {p.subject} · Class {p.class} · {p.count} Questions</p>
                {p.submitted && <p className="text-slate-500 text-xs mt-0.5">Submitted: {p.submitted}</p>}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[p.status]}`}>{p.status}</span>
            </div>
            {tab === "Pending Review" && (
              <div className="mt-4 flex gap-3">
                <button onClick={() => setConfirm({ paper: p, action: "approve" })}
                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-slate-900 px-4 py-2 rounded-xl text-sm"><MdCheckCircle size={16} /> Approve</button>
                <button onClick={() => setConfirm({ paper: p, action: "reject" })}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-slate-900 px-4 py-2 rounded-xl text-sm"><MdCancel size={16} /> Reject</button>
                <button className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-900 px-4 py-2 rounded-xl text-sm"><MdVisibility size={16} /> View Paper</button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-slate-500 py-12">No papers in this category.</p>}
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-50 rounded-2xl border border-slate-200 w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-1 capitalize">{confirm.action} Paper?</h3>
              <p className="text-slate-500 text-sm mb-4">"{confirm.paper.title}" by {confirm.paper.teacher}</p>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                placeholder={confirm.action === "reject" ? "Rejection reason (required)" : "Optional comment..."}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none resize-none mb-4" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirm(null)} className="px-4 py-2 rounded-xl text-sm bg-slate-700 hover:bg-slate-600 text-slate-900">Cancel</button>
                <button onClick={() => setConfirm(null)}
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
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <MdSchool size={14} /> <span>Academic</span> <span>/</span>
              <span className="text-slate-700">Question Bank</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><MdOutlineLibraryBooks className="text-primary-400" /> Question Bank</h1>
            <p className="text-slate-500 text-sm mt-1">{role === "teacher" ? "Manage and submit question papers" : "Review and approve question papers"}</p>
          </div>
        </div>

        {role === "teacher" ? <TeacherView /> : <PrincipalView />}
      </motion.div>
    </div>
  );
}
