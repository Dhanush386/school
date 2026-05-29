import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdSearch, MdBook, MdMenuBook, MdDownload, MdClose,
  MdCheckCircle, MdWarning, MdAdd, MdFilterList,
} from 'react-icons/md';
import { fadeInUp } from '../../animations/fadeIn';
import { staggerContainer, staggerItem } from '../../animations/stagger';
import { libraryService } from '../../services/moduleServices';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const gradients = [
  'from-blue-500 to-cyan-600',
  'from-green-500 to-emerald-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-blue-600'
];

const getGradient = (id) => {
  if (!id) return gradients[0];
  const charCode = id.charCodeAt(id.length - 1) || 0;
  return gradients[charCode % gradients.length];
};

const BookCard = ({ book, onView }) => (
  <motion.div variants={staggerItem} whileHover={{ y: -4, scale: 1.02 }}
    className="rounded-2xl overflow-hidden border border-white/5 cursor-pointer flex flex-col h-full" style={{ background: 'rgba(30,41,59,0.9)' }}
    onClick={() => onView(book)}>
    <div className={`h-32 bg-gradient-to-br ${getGradient(book._id)} flex items-center justify-center`}>
      <MdBook className="text-white text-5xl opacity-60" />
    </div>
    <div className="p-4 flex flex-col flex-1">
      <p className="text-white text-sm font-semibold line-clamp-2 leading-tight">{book.title}</p>
      <p className="text-slate-400 text-xs mt-1">{book.author}</p>
      <div className="mt-auto pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-0.5 bg-white/10 text-slate-300 rounded-lg truncate max-w-[80px]" title={book.category || 'General'}>{book.category || 'General'}</span>
          <span className={`text-xs px-2 py-0.5 rounded-lg font-medium whitespace-nowrap ${book.availableCopies > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {book.availableCopies > 0 ? `${book.availableCopies} available` : 'All issued'}
          </span>
        </div>
        {book.isEbook && (
          <div className="mt-2 flex items-center gap-1 text-primary-400 text-xs">
            <MdMenuBook className="text-sm" /> eBook available
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const LibraryPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Add Book state
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', author: '', isbn: '', subject: '', totalCopies: 1, category: '', publisher: ''
  });

  const categories = ['all', 'CS', 'Math', 'Physics', 'Chemistry', 'English', 'General'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const booksRes = await libraryService.getBooks({ limit: 100 });
      setBooks(booksRes.data.data || []);
      
      if (user?.role === 'student') {
        const issuedRes = await libraryService.getIssuedBooks();
        setIssuedBooks(issuedRes.data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch library data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.isbn) {
      return toast.error('Title, author, and ISBN are required.');
    }
    setSubmitting(true);
    try {
      await libraryService.addBook(form);
      toast.success('Book added successfully!');
      setShowAddForm(false);
      setForm({ title: '', author: '', isbn: '', subject: '', totalCopies: 1, category: '', publisher: '' });
      fetchData(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add book');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = books.filter(b => {
    const matchesCategory = category === 'all' || (b.category === category) || (!b.category && category === 'General');
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'ebooks' ? b.isEbook : true;
    return matchesCategory && matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Library</h1>
          <p className="text-slate-400 text-sm mt-1">Browse books, eBooks, and manage the library</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-slate-400 text-xs text-right">
            <span className="text-green-400 font-bold block sm:inline">{books.reduce((a, b) => a + (b.availableCopies || 0), 0)}</span> books available
          </div>
          {isAdmin && (
            <button onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap">
              <MdAdd /> Add Book
            </button>
          )}
        </div>
      </motion.div>

      {/* Search + Filter */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-600 outline-none focus:border-primary-500/50" />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${category === c ? 'bg-primary-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit overflow-x-auto max-w-full">
        {[['all', 'All Books'], ...(user?.role === 'student' ? [['issued', 'My Issued Books']] : []), ['ebooks', 'eBooks']].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === val ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'all' || tab === 'ebooks' ? (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.length > 0 ? (
            filtered.map(book => <BookCard key={book._id} book={book} onView={setSelectedBook} />)
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm border border-dashed border-white/10 rounded-2xl">
              No books found matching your criteria.
            </div>
          )}
        </motion.div>
      ) : (
        /* Issued Books Table */
        <motion.div variants={fadeInUp} className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: 'rgba(30,41,59,0.8)' }}>
          <div className="p-5 border-b border-white/5">
            <h3 className="text-white font-semibold">My Issued Books</h3>
          </div>
          <div className="divide-y divide-white/5">
            {issuedBooks.length > 0 ? (
              issuedBooks.map(b => (
                <div key={b._id} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient(b?.book?._id)} flex items-center justify-center flex-shrink-0`}>
                    <MdBook className="text-white text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{b?.book?.title || 'Unknown Book'}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{b?.book?.author || 'Unknown Author'}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-slate-400 text-xs">Issued: {new Date(b.issueDate).toLocaleDateString()}</p>
                    <p className="text-slate-400 text-xs">Due: {new Date(b.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0 ${b.isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {b.isOverdue ? `⚠ Overdue` : 'Issued'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">
                You have no currently issued books.
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedBook(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl border border-white/10 overflow-hidden"
              style={{ background: 'rgba(15,23,42,0.95)' }}
              onClick={e => e.stopPropagation()}>
              <div className={`h-32 bg-gradient-to-br ${getGradient(selectedBook._id)} flex items-center justify-center relative`}>
                <MdBook className="text-white text-6xl opacity-50" />
                <button onClick={() => setSelectedBook(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors">
                  <MdClose />
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-white text-xl font-bold">{selectedBook.title}</h2>
                <p className="text-slate-400 text-sm mt-1">{selectedBook.author}</p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[
                    ['ISBN', selectedBook.isbn], ['Category', selectedBook.category || 'General'],
                    ['Subject', selectedBook.subject || 'N/A'], ['Publisher', selectedBook.publisher || 'N/A'],
                    ['Total Copies', selectedBook.totalCopies], ['Available', selectedBook.availableCopies]
                  ].map(([lbl, val]) => (
                    <div key={lbl} className="bg-white/5 rounded-xl p-3">
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider">{lbl}</p>
                      <p className="text-slate-200 text-sm font-medium mt-0.5 truncate">{val}</p>
                    </div>
                  ))}
                </div>
                {selectedBook.description && (
                  <div className="mt-4">
                    <p className="text-slate-500 text-xs font-medium mb-1">Description</p>
                    <p className="text-slate-300 text-sm leading-relaxed text-justify">{selectedBook.description}</p>
                  </div>
                )}
                {selectedBook.isEbook && (
                  <button className="w-full mt-5 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    <MdDownload className="text-lg" /> Download eBook
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Add Book Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowAddForm(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar"
              style={{ background: 'rgba(15,23,42,0.98)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-lg font-bold">Add New Book</h2>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white transition-colors">
                  <MdClose className="text-xl" />
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Title *</label>
                  <input type="text" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Author *</label>
                  <input type="text" required value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">ISBN *</label>
                    <input type="text" required value={form.isbn} onChange={e => setForm(p => ({ ...p, isbn: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Total Copies *</label>
                    <input type="number" min="1" required value={form.totalCopies} onChange={e => setForm(p => ({ ...p, totalCopies: parseInt(e.target.value) || 1 }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-primary-500/50">
                      <option value="">Select...</option>
                      {categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Subject</label>
                    <input type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Publisher</label>
                  <input type="text" value={form.publisher} onChange={e => setForm(p => ({ ...p, publisher: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full mt-4 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding...</> : 'Add Book'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LibraryPage;
