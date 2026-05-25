const variantClasses = {
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  danger:  'bg-red-500/15 text-red-400 border border-red-500/30',
  info:    'bg-sky-500/15 text-sky-400 border border-sky-500/30',
  neutral: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
  primary: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

/**
 * Badge – a small pill label for statuses, categories, or counts.
 *
 * @param {'success'|'warning'|'danger'|'info'|'neutral'|'primary'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {string} className  – extra Tailwind classes
 */
const Badge = ({ children, variant = 'neutral', size = 'md', className = '' }) => {
  const base = variantClasses[variant] ?? variantClasses.neutral;
  const sz   = sizeClasses[size]    ?? sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wide ${base} ${sz} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
