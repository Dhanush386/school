import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, sub, color, trend, onClick }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    onClick={onClick}
    className={`relative rounded-2xl p-5 overflow-hidden border border-white/5 ${onClick ? 'cursor-pointer' : ''}`}
    style={{ background: 'rgba(30,41,59,0.8)' }}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 bg-gradient-to-br ${color}`} />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-white text-3xl font-bold mt-1">{value}</p>
        {sub && <p className="text-slate-400 text-xs mt-1">{sub}</p>}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <span>{trend >= 0 ? '▲' : '▼'}</span>
            {Math.abs(trend)}% from last month
          </div>
        )}
      </div>
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0`}>
        <Icon className="text-white text-xl" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
