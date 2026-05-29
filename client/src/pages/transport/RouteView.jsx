import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDirectionsBus, MdLocationOn, MdAccessTime, MdPerson,
  MdPhone, MdCheckCircle, MdArrowForward, MdClose,
} from 'react-icons/md';
import { fadeInUp } from '../../animations/fadeIn';
import { staggerContainer, staggerItem } from '../../animations/stagger';

const routes = [];

const RouteView = () => {
  const [myRequest, setMyRequest] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedStop, setSelectedStop] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currentRoute = routes.find(r => r.id === myRequest?.routeId);

  const handleApply = async () => {
    if (!selectedRoute || !selectedStop) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setMyRequest({ routeId: parseInt(selectedRoute), pickupStop: selectedStop, status: 'pending', feeStatus: 'pending' });
    setShowForm(false);
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Transport</h1>
          <p className="text-slate-400 text-sm mt-1">View bus routes and manage your transport subscription</p>
        </div>
        {!myRequest && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors">
            Apply for Transport
          </button>
        )}
      </motion.div>

      {/* My Transport Status */}
      {myRequest && (
        <motion.div variants={fadeInUp} initial="initial" animate="animate"
          className="rounded-2xl p-5 border border-primary-500/20" style={{ background: 'rgba(30,41,59,0.9)' }}>
          <h3 className="text-white font-semibold mb-4">My Transport</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Route</p>
              <p className="text-white font-bold mt-1">{currentRoute?.routeName}</p>
              <p className="text-slate-400 text-xs mt-0.5">{currentRoute?.routeNumber} · {currentRoute?.busNumber}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Pickup Stop</p>
              <p className="text-white font-bold mt-1">{myRequest.pickupStop}</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {currentRoute?.stops.find(s => s.name === myRequest.pickupStop)?.time}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Status</p>
              <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-sm font-medium ${myRequest.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {myRequest.status === 'approved' ? '✓ Approved' : '⏳ Pending Review'}
              </span>
              <p className="text-slate-400 text-xs mt-1">Fee: {myRequest.feeStatus === 'paid' ? '✓ Paid' : `₹${currentRoute?.fee} due`}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Routes Grid */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {routes.map(route => (
          <motion.div key={route.id} variants={staggerItem}
            className="rounded-2xl p-5 border border-white/5" style={{ background: 'rgba(30,41,59,0.8)' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-primary-600/20 text-primary-400 text-xs font-bold rounded-lg">{route.routeNumber}</span>
                  <h3 className="text-white font-semibold text-sm">{route.routeName}</h3>
                </div>
                <p className="text-slate-400 text-xs mt-1">{route.busNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">₹{route.fee}</p>
                <p className="text-slate-500 text-xs">per semester</p>
              </div>
            </div>

            {/* Driver Info */}
            <div className="flex items-center gap-3 p-3 bg-white/3 rounded-xl mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                <MdPerson className="text-white text-sm" />
              </div>
              <div>
                <p className="text-white text-xs font-medium">{route.driverName}</p>
                <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                  <MdPhone className="text-xs" /> {route.driverPhone}
                </div>
              </div>
            </div>

            {/* Stops Timeline */}
            <div className="space-y-2">
              {route.stops.map((stop, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${i === 0 || i === route.stops.length - 1 ? 'bg-primary-400' : 'bg-slate-600'}`} />
                    {i < route.stops.length - 1 && <div className="w-px h-4 bg-slate-700" />}
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-slate-400 text-xs font-mono w-10 flex-shrink-0">{stop.time}</span>
                    <span className={`text-xs truncate ${i === route.stops.length - 1 ? 'text-primary-400 font-medium' : 'text-slate-300'}`}>{stop.name}</span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => { setSelectedRoute(route.id.toString()); setShowForm(true); }}
              className="mt-4 w-full py-2 bg-primary-600/20 hover:bg-primary-600/40 text-primary-400 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1">
              Select This Route <MdArrowForward />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-3xl p-6 border border-white/10"
              style={{ background: 'rgba(15,23,42,0.98)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-lg font-bold">Apply for Transport</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><MdClose className="text-xl" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Select Route</label>
                  <select value={selectedRoute} onChange={e => { setSelectedRoute(e.target.value); setSelectedStop(''); }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary-500/50">
                    <option value="">-- Choose a route --</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.routeNumber} · {r.routeName}</option>)}
                  </select>
                </div>
                {selectedRoute && (
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Pickup Stop</label>
                    <select value={selectedStop} onChange={e => setSelectedStop(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary-500/50">
                      <option value="">-- Choose your stop --</option>
                      {routes.find(r => r.id === parseInt(selectedRoute))?.stops.slice(0, -1).map(s => (
                        <option key={s.name} value={s.name}>{s.name} ({s.time})</option>
                      ))}
                    </select>
                  </div>
                )}
                <button onClick={handleApply} disabled={!selectedRoute || !selectedStop || submitting}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : 'Submit Application'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RouteView;
