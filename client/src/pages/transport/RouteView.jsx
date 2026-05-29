import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDirectionsBus, MdLocationOn, MdAccessTime, MdPerson,
  MdPhone, MdCheckCircle, MdArrowForward, MdClose, MdAdd, MdRemove
} from 'react-icons/md';
import { fadeInUp } from '../../animations/fadeIn';
import { staggerContainer, staggerItem } from '../../animations/stagger';
import { transportService } from '../../services/moduleServices';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const RouteView = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [routes, setRoutes] = useState([]);
  const [myRequest, setMyRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Student apply state
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedStop, setSelectedStop] = useState('');
  const [applying, setApplying] = useState(false);

  // Admin add route state
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    routeNumber: '', routeName: '', startPoint: '', endPoint: '',
    vehicleNumber: '', driverName: '', driverContact: '',
    stops: [{ name: '', time: '' }]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const routesRes = await transportService.getRoutes();
      setRoutes(routesRes.data.data || []);
      
      if (user?.role === 'student') {
        try {
          const reqRes = await transportService.getMyRequest();
          if (reqRes.data.success !== false) {
            setMyRequest(reqRes.data.data);
          }
        } catch (e) {
          // If 404, it means no request exists, which is fine
          if (e.response?.status !== 404) {
            console.error('Error fetching my transport request:', e);
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch transport data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const currentRoute = myRequest ? (myRequest.route || routes.find(r => r._id === myRequest.route?._id || r._id === myRequest.route)) : null;

  const handleApply = async () => {
    if (!selectedRoute || !selectedStop) return;
    setApplying(true);
    try {
      await transportService.requestTransport({ routeId: selectedRoute, preferredStop: selectedStop, academicYear: '2024-25' });
      toast.success('Transport application submitted!');
      setShowApplyForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleAddStop = () => {
    setForm(p => ({ ...p, stops: [...p.stops, { name: '', time: '' }] }));
  };

  const handleRemoveStop = (index) => {
    if (form.stops.length <= 1) return;
    setForm(p => ({ ...p, stops: p.stops.filter((_, i) => i !== index) }));
  };

  const handleStopChange = (index, field, value) => {
    setForm(p => {
      const newStops = [...p.stops];
      newStops[index][field] = value;
      return { ...p, stops: newStops };
    });
  };

  const handleAddRouteSubmit = async (e) => {
    e.preventDefault();
    if (!form.routeNumber || !form.routeName || !form.startPoint || !form.endPoint || !form.vehicleNumber) {
      return toast.error('Please fill all required fields');
    }
    setAdding(true);
    try {
      await transportService.addRoute(form);
      toast.success('Route added successfully!');
      setShowAddForm(false);
      setForm({
        routeNumber: '', routeName: '', startPoint: '', endPoint: '',
        vehicleNumber: '', driverName: '', driverContact: '',
        stops: [{ name: '', time: '' }]
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add route');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Transport</h1>
          <p className="text-slate-400 text-sm mt-1">{isAdmin ? 'Manage transport routes and buses' : 'View bus routes and manage your transport subscription'}</p>
        </div>
        {!isAdmin && !myRequest && !loading && (
          <button onClick={() => setShowApplyForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors">
            Apply for Transport
          </button>
        )}
        {isAdmin && (
          <button onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors">
            <MdAdd /> Add Route
          </button>
        )}
      </motion.div>

      {/* My Transport Status */}
      {myRequest && currentRoute && (
        <motion.div variants={fadeInUp} initial="initial" animate="animate"
          className="rounded-2xl p-5 border border-primary-500/20" style={{ background: 'rgba(30,41,59,0.9)' }}>
          <h3 className="text-white font-semibold mb-4">My Transport</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Route</p>
              <p className="text-white font-bold mt-1">{currentRoute.routeName}</p>
              <p className="text-slate-400 text-xs mt-0.5">{currentRoute.routeNumber} · {currentRoute.busNumber}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Pickup Stop</p>
              <p className="text-white font-bold mt-1">{myRequest.preferredStop || myRequest.pickupStop}</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {currentRoute.stops?.find(s => s.name === (myRequest.preferredStop || myRequest.pickupStop))?.time || '--:--'}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Status</p>
              <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-sm font-medium ${myRequest.status === 'approved' ? 'bg-green-500/20 text-green-400' : myRequest.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {myRequest.status === 'approved' ? '✓ Approved' : myRequest.status === 'rejected' ? '❌ Rejected' : '⏳ Pending Review'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {routes.length > 0 ? routes.map(route => (
            <motion.div key={route._id} variants={staggerItem}
              className="rounded-2xl p-5 border border-white/5" style={{ background: 'rgba(30,41,59,0.8)' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-primary-600/20 text-primary-400 text-xs font-bold rounded-lg">{route.routeNumber}</span>
                    <h3 className="text-white font-semibold text-sm">{route.routeName}</h3>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{route.busNumber}</p>
                </div>
                {!route.isActive && (
                  <div className="text-right">
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-lg">Inactive</span>
                  </div>
                )}
              </div>

              {/* Driver Info */}
              <div className="flex items-center gap-3 p-3 bg-white/3 rounded-xl mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                  <MdPerson className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-white text-xs font-medium">{route.driverName || 'Not Assigned'}</p>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                    <MdPhone className="text-xs" /> {route.driverPhone || 'No Contact'}
                  </div>
                </div>
              </div>

              {/* Stops Timeline */}
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                {route.stops && route.stops.length > 0 ? route.stops.map((stop, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${i === 0 || i === route.stops.length - 1 ? 'bg-primary-400' : 'bg-slate-600'}`} />
                      {i < route.stops.length - 1 && <div className="w-px h-4 bg-slate-700" />}
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-slate-400 text-xs font-mono w-10 flex-shrink-0">{stop.time || '--:--'}</span>
                      <span className={`text-xs truncate ${i === route.stops.length - 1 ? 'text-primary-400 font-medium' : 'text-slate-300'}`}>{stop.name}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500 text-xs">No stops added.</p>
                )}
              </div>

              {!isAdmin && route.isActive && (
                <button onClick={() => { setSelectedRoute(route._id); setShowApplyForm(true); }}
                  className="mt-4 w-full py-2 bg-primary-600/20 hover:bg-primary-600/40 text-primary-400 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1">
                  Select This Route <MdArrowForward />
                </button>
              )}
            </motion.div>
          )) : (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm border border-dashed border-white/10 rounded-2xl">
              No active transport routes found.
            </div>
          )}
        </motion.div>
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowApplyForm(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-3xl p-6 border border-white/10"
              style={{ background: 'rgba(15,23,42,0.98)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-lg font-bold">Apply for Transport</h2>
                <button onClick={() => setShowApplyForm(false)} className="text-slate-400 hover:text-white"><MdClose className="text-xl" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Select Route</label>
                  <select value={selectedRoute} onChange={e => { setSelectedRoute(e.target.value); setSelectedStop(''); }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary-500/50">
                    <option value="">-- Choose a route --</option>
                    {routes.map(r => <option key={r._id} value={r._id}>{r.routeNumber} · {r.routeName}</option>)}
                  </select>
                </div>
                {selectedRoute && (
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Pickup Stop</label>
                    <select value={selectedStop} onChange={e => setSelectedStop(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary-500/50">
                      <option value="">-- Choose your stop --</option>
                      {routes.find(r => r._id === selectedRoute)?.stops?.slice(0, -1).map(s => (
                        <option key={s.name} value={s.name}>{s.name} {s.time ? `(${s.time})` : ''}</option>
                      ))}
                    </select>
                  </div>
                )}
                <button onClick={handleApply} disabled={!selectedRoute || !selectedStop || applying}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  {applying ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : 'Submit Application'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Add Route Modal */}
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
                <h2 className="text-white text-lg font-bold">Add New Route</h2>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white transition-colors">
                  <MdClose className="text-xl" />
                </button>
              </div>
              <form onSubmit={handleAddRouteSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Route Number *</label>
                    <input type="text" required value={form.routeNumber} onChange={e => setForm(p => ({ ...p, routeNumber: e.target.value }))}
                      placeholder="e.g. R-01" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Route Name *</label>
                    <input type="text" required value={form.routeName} onChange={e => setForm(p => ({ ...p, routeName: e.target.value }))}
                      placeholder="e.g. City Center Route" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Start Point *</label>
                    <input type="text" required value={form.startPoint} onChange={e => setForm(p => ({ ...p, startPoint: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">End Point (College) *</label>
                    <input type="text" required value={form.endPoint} onChange={e => setForm(p => ({ ...p, endPoint: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Bus/Vehicle Number *</label>
                  <input type="text" required value={form.vehicleNumber} onChange={e => setForm(p => ({ ...p, vehicleNumber: e.target.value }))}
                    placeholder="e.g. TN-07-AB-1234" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Driver Name</label>
                    <input type="text" value={form.driverName} onChange={e => setForm(p => ({ ...p, driverName: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Driver Contact</label>
                    <input type="text" value={form.driverContact} onChange={e => setForm(p => ({ ...p, driverContact: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary-500/50" />
                  </div>
                </div>
                
                {/* Stops Array */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-slate-400 text-xs uppercase tracking-wider block">Stops List</label>
                    <button type="button" onClick={handleAddStop} className="text-primary-400 text-xs flex items-center gap-1 hover:text-primary-300">
                      <MdAdd /> Add Stop
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.stops.map((stop, index) => (
                      <div key={index} className="flex gap-3 items-start bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex-1 space-y-3">
                          <div>
                            <input type="text" placeholder="Stop Name (e.g. Railway Station)" required
                              value={stop.name} onChange={e => handleStopChange(index, 'name', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary-500/50" />
                          </div>
                          <div>
                            <input type="time" placeholder="Time" required
                              value={stop.time} onChange={e => handleStopChange(index, 'time', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary-500/50" />
                          </div>
                        </div>
                        {form.stops.length > 1 && (
                          <button type="button" onClick={() => handleRemoveStop(index)} className="text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-colors">
                            <MdRemove />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={adding}
                  className="w-full mt-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  {adding ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding...</> : 'Save Route'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RouteView;
