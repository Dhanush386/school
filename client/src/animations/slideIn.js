/**
 * Slide animation variants for modals, drawers, and panels.
 * Use with Framer Motion's `motion` component and AnimatePresence.
 */

/** Slides in from the bottom — ideal for mobile bottom sheets and toast-like modals */
export const slideInBottom = {
  initial: { opacity: 0, y: '100%' },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
  },
};

/** Slides in from the top — ideal for notification bars and top drawers */
export const slideInTop = {
  initial: { opacity: 0, y: '-100%' },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
  },
  exit: {
    opacity: 0,
    y: '-100%',
    transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
  },
};

/** Slides in from the right — ideal for side panels and detail drawers */
export const slideInRight = {
  initial: { opacity: 0, x: '100%' },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
  },
};

/** Slides in from the left — ideal for sidebars and navigation menus */
export const slideInLeft = {
  initial: { opacity: 0, x: '-100%' },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
  },
  exit: {
    opacity: 0,
    x: '-100%',
    transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
  },
};

/**
 * Subtle slide-up variant — for cards and inline panels (smaller y offset).
 * Differs from slideInBottom in that it doesn't originate off-screen.
 */
export const slideUpSubtle = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: 40,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

/**
 * Scale + fade variant for centered modals/dialogs.
 */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};
