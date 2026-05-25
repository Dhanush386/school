const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-[3px]',
  lg: 'w-12 h-12 border-4',
};

const colorMap = {
  indigo:  'border-indigo-500',
  emerald: 'border-emerald-500',
  sky:     'border-sky-500',
  amber:   'border-amber-500',
  white:   'border-white',
  slate:   'border-slate-400',
};

/**
 * Spinner – animated loading indicator.
 *
 * @param {'sm'|'md'|'lg'} size
 * @param {'indigo'|'emerald'|'sky'|'amber'|'white'|'slate'} color
 * @param {string} className  – extra Tailwind classes applied to the wrapper
 */
const Spinner = ({ size = 'md', color = 'indigo', className = '' }) => {
  const ring  = sizeMap[size]  ?? sizeMap.md;
  const clr   = colorMap[color] ?? colorMap.indigo;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`rounded-full border-t-transparent animate-spin ${ring} ${clr}`}
        role="status"
        aria-label="Loading…"
      />
    </div>
  );
};

export default Spinner;
