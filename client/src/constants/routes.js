/**
 * Centralised route path constants for the School ERP application.
 *
 * Import and use these instead of hard-coding path strings,
 * so that path changes only need to be made in one place.
 *
 * @example
 *   import { ROUTES } from '../constants/routes';
 *   navigate(ROUTES.DASHBOARD);
 */

export const ROUTES = {
  // ─── Auth ─────────────────────────────────────────────────────────────────
  LOGIN: '/login',
  CHANGE_PASSWORD: '/change-password',

  // ─── Core ─────────────────────────────────────────────────────────────────
  DASHBOARD: '/dashboard',

  // ─── Academic ─────────────────────────────────────────────────────────────
  ACADEMIC: '/academic',
  TIMETABLE: '/academic/timetable',
  ATTENDANCE: '/academic/attendance',
  ASSIGNMENTS: '/academic/assignments',
  QUESTION_BANK: '/academic/question-bank',
  LESSON_PLAN: '/academic/lesson-plan',

  // ─── Finance ──────────────────────────────────────────────────────────────
  FEES: '/fees',

  // ─── Services ─────────────────────────────────────────────────────────────
  HOSTEL: '/hostel',
  LIBRARY: '/library',
  TRANSPORT: '/transport',

  // ─── Communication ────────────────────────────────────────────────────────
  FEEDBACK: '/feedback',
  COMPLAINTS: '/core',
  NOTIFICATIONS: '/notifications',

  // ─── Admission ────────────────────────────────────────────────────────────
  CERTIFICATE: '/admission/certificate',

  // ─── Staff / HR ───────────────────────────────────────────────────────────
  HRD: '/hrd',

  // ─── Reporting ────────────────────────────────────────────────────────────
  REPORTS: '/reports',

  // ─── User ─────────────────────────────────────────────────────────────────
  PROFILE: '/profile',
  SETTINGS: '/settings',
};
