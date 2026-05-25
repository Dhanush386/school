import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdSearch, MdBook, MdMenuBook, MdDownload, MdClose,
  MdCheckCircle, MdWarning, MdAdd, MdFilterList,
} from 'react-icons/md';
import { fadeInUp } from '../../animations/fadeIn';
import { staggerContainer, staggerItem } from '../../animations/stagger';

const books = [
  { id: 1, title: 'Introduction to Algorithms', author: 'Cormen et al.', category: 'CS', isbn: '978-0-262-03384-8', total: 5, available: 2, isEbook: true, color: 'from-blue-500 to-cyan-600' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', category: 'CS', isbn: '978-0-13-235088-4', total: 3, available: 0, isEbook: true, color: 'from-green-500 to-emerald-600' },
  { id: 3, title: 'Engineering Mathematics', author: 'K.A. Stroud', category: 'Math', isbn: '978-1-137-03120-4', total: 8, available: 5, isEbook: false, color: 'from-violet-500 to-purple-600' },
  { id: 4, title: 'Physics for Scientists', author: 'Raymond Serway', category: 'Physics', isbn: '978-1-337-09334-4', total: 6, available: 3, isEbook: false, color: 'from-amber-500 to-orange-600' },
  { id: 5, title: 'Database System Concepts', author: 'Silberschatz et al.', category: 'CS', isbn: '978-0-07-352332-3', total: 4, available: 1, isEbook: true, color: 'from-pink-500 to-rose-600' },
  { id: 6, title: 'Operating System Concepts', author: 'Silberschatz et al.', category: 'CS', isbn: '978-1-119-32091-3', total: 7, available: 4, isEbook: true, color: 'from-indigo-500 to-blue-600' },
];

const issuedBooks = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', issuedAt: '2024-06-10', dueDate: '2024-06-24', fine: 0, status: 'overdue' },
  { id: 2, title: 'Introduction to Algorithms', author: 'Cormen et al.', issuedAt: '2024-06-15', dueDate: '2024-06-29', fine: 0, status: 'issued' },
];

const BookCard = ({ book, onView }) => (
  <motion.div variants={staggerItem} whileHover={{ y: -4, scale: 1.02 }}
    className="rounded-2xl overflow-hidden border border-white/5 cursor-pointer" style={{ background: 'rgba(30,41,59,0.9)' }}
    onClick={() => onView(book)}>
    <div className={`h-32 bg-gradient-to-br ${book.color} flex items-center justify-center`}>
      <MdBook className="text-white text-5xl opacity-60" />
    </div>
    <div className="p-4">
      <p className="text-white text-sm font-semibold line-clamp-2 leading-tight">{book.title}</p>
      <p className="text-slate-400 text-xs mt-1">{book.author}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs px-2 py-0.5 bg-white/10 text-slate-300 rounded-lg">{book.category}</span>
        <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${book.available > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {book.available > 0 ? `${book.available} available` : 'All issued'}
        </span>
      </div>
      {book.isEbook && (
        <div className="mt-2 flex items-center gap-1 text-primary-400 text-xs">
          <MdMenuBook className="text-sm" /> eBook available
        </div>
      )}
    </div>
  </motion.div>
);

const LibraryPage = () => {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [category, setCategory] = useState('all');

  const categories = ['all', 'CS', 'Math', 'Physics', 'Chemistry', 'English'];
  const filtered = books.filter(b =>
    (category === 'all' || b.category === category) &&
    (b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())) &&
    (tab === 'ebooks' ? b.isEbook : true)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Library</h1>
          <p className="text-slate-400 text-sm mt-1">Browse books, eBooks, and manage your issued books</p>
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <span className="text-green-400 font-bold">{books.reduce((a, b) => a + b.available, 0)}</span> books available
        </div>
      </motion.div>

      {/* Search + Filter */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-600 outline-none focus:border-primary-500/50" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${category === c ? 'bg-primary-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
        {[['all', 'All Books'], ['issued', 'My Issued Books'], ['ebooks', 'eBooks']].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === val ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {tab === 'all' || tab === 'ebooks' ? (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.map(book => <BookCard key={book.id} book={book} onView={setSelectedBook} />)}
        </motion.div>
      ) : (
        /* Issued Books Table */
        <motion.div variants={fadeInUp} className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: 'rgba(30,41,59,0.8)' }}>
          <div className="p-5 border-b border-white/5">
            <h3 className="text-white font-semibold">My Issued Books</h3>
          </div>
          <div className="divide-y divide-white/5">
            {issuedBooks.map(b => (
              <div key={b.id} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <MdBook className="text-white text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{b.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{b.author}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-slate-400 text-xs">Issued: {b.issuedAt}</p>
                  <p className="text-slate-400 text-xs">Due: {b.dueDate}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0 ${b.status === 'overdue' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {b.status === 'overdue' ? `⚠ Overdue` : 'Issued'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedBook(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl border border-white/10 overflow-hidden"
              style={{ background: 'rgba(15,23,42,0.95)' }}
              onClick={e => e.stopPropagation()}>
              <div className={`h-32 bg-gradient-to-br ${selectedBook.color} flex items-center justify-center relative`}>
                <MdBook className="text-white text-6xl opacity-50" />
                <button onClick={() => setSelectedBook(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50">
                  <MdClose />
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-white text-xl font-bold">{selectedBook.title}</h2>
                <p className="text-slate-400 text-sm mt-1">{selectedBook.author}</p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[
                    ['ISBN', selectedBook.isbn], ['Category', selectedBook.category],
                    ['Total Copies', selectedBook.total], ['Available', selectedBook.available],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-white/5 rounded-xl p-3">
                      <p className="text-slate-500 text-xs">{label}</p>
                      <p className="text-white text-sm font-semibold mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-5">
                  {selectedBook.isEbook && (
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors">
                      <MdMenuBook /> Read eBook
                    </button>
                  )}
                  <button className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${selectedBook.available > 0 ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-white/5 text-slate-500 cursor-not-allowed'}`}
                    disabled={selectedBook.available === 0}>
                    <MdCheckCircle /> {selectedBook.available > 0 ? 'Issue Book' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LibraryPage;
