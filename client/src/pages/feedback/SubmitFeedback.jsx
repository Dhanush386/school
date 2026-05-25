import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdStar, MdStarBorder, MdCheckCircle, MdSend } from 'react-icons/md';
import { fadeInUp } from '../../animations/fadeIn';
import { staggerContainer, staggerItem } from '../../animations/stagger';
import toast from 'react-hot-toast';

const activeForms = [
  { id: 1, title: 'Semester End Feedback', description: 'Rate your experience this semester across all facilities.', dueDate: '2024-06-30', questions: 6, targetRole: 'student' },
  { id: 2, title: 'Canteen Quality Survey', description: 'Help us improve food quality and service at the canteen.', dueDate: '2024-06-25', questions: 4, targetRole: 'all' },
];

const formQuestions = [
  { id: 1, question: 'How would you rate the teaching quality overall?', type: 'rating' },
  { id: 2, question: 'Rate the library facilities and resources.', type: 'rating' },
  { id: 3, question: 'How satisfied are you with the hostel facilities?', type: 'rating' },
  { id: 4, question: 'Rate the overall campus cleanliness and maintenance.', type: 'rating' },
  { id: 5, question: 'What improvements would you suggest for the canteen?', type: 'text' },
  { id: 6, question: 'How likely are you to recommend our college to others?', type: 'multiple_choice', options: ['Definitely', 'Probably', 'Unsure', 'Probably Not', 'Definitely Not'] },
];

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <button key={star} type="button" onClick={() => onChange(star)}
        className={`text-2xl transition-colors ${star <= value ? 'text-amber-400' : 'text-slate-600 hover:text-amber-300'}`}>
        {star <= value ? <MdStar /> : <MdStarBorder />}
      </button>
    ))}
  </div>
);

const SubmitFeedback = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAnswer = (qId, val) => setAnswers(prev => ({ ...prev, [qId]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <h1 className="text-white text-2xl font-bold">Feedback & Suggestions</h1>
        <p className="text-slate-400 text-sm mt-1">Your feedback helps us improve the campus experience</p>
      </motion.div>

      {!activeForm ? (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4">
          {activeForms.map(form => (
            <motion.div key={form.id} variants={staggerItem}
              className="rounded-2xl p-5 border border-white/5 hover:border-primary-500/20 transition-colors" style={{ background: 'rgba(30,41,59,0.8)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{form.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{form.description}</p>
                  <div className="flex gap-3 mt-3">
                    <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-lg">{form.questions} questions</span>
                    <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg">Due: {form.dueDate}</span>
                  </div>
                </div>
                <button onClick={() => { setActiveForm(form); setAnswers({}); setSubmitted(false); }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0">
                  Fill Feedback <MdSend />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : submitted ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl p-10 text-center border border-green-500/20" style={{ background: 'rgba(30,41,59,0.8)' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdCheckCircle className="text-green-400 text-4xl" />
          </motion.div>
          <h2 className="text-white text-xl font-bold">Thank You!</h2>
          <p className="text-slate-400 mt-2">Your feedback for <strong className="text-white">"{activeForm.title}"</strong> has been submitted successfully.</p>
          <button onClick={() => setActiveForm(null)} className="mt-6 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors">
            Back to Forms
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: 'rgba(30,41,59,0.8)' }}>
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">{activeForm.title}</h3>
              <p className="text-slate-400 text-xs mt-0.5">{activeForm.description}</p>
            </div>
            <button onClick={() => setActiveForm(null)} className="text-slate-400 hover:text-white px-3 py-1.5 bg-white/5 rounded-lg text-sm">Cancel</button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-6">
            {formQuestions.map((q, i) => (
              <div key={q.id} className="p-4 bg-white/3 rounded-xl border border-white/5">
                <p className="text-white text-sm font-medium mb-3">{i + 1}. {q.question}</p>
                {q.type === 'rating' && (
                  <StarRating value={answers[q.id] || 0} onChange={v => handleAnswer(q.id, v)} />
                )}
                {q.type === 'text' && (
                  <textarea value={answers[q.id] || ''} onChange={e => handleAnswer(q.id, e.target.value)} rows={3} placeholder="Your answer..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-slate-600 resize-none outline-none focus:border-primary-500/50" />
                )}
                {q.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {q.options.map(opt => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${answers[q.id] === opt ? 'border-primary-500 bg-primary-500' : 'border-slate-600 group-hover:border-primary-400'}`}>
                          {answers[q.id] === opt && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <input type="radio" name={`q${q.id}`} value={opt} className="sr-only" onChange={() => handleAnswer(q.id, opt)} />
                        <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button type="submit" disabled={submitting}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : <><MdSend />Submit Feedback</>}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default SubmitFeedback;
