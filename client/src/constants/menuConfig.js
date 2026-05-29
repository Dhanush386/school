/**
 * Sidebar menu configuration for the School ERP system.
 *
 * Each section has:
 *   - section:  Display heading in the sidebar
 *   - roles:    Which roles can see this entire section
 *   - items:    Array of nav items
 *
 * Each item has:
 *   - id:     Unique string identifier
 *   - label:  Display text
 *   - icon:   react-icons/md component name (string)
 *   - path:   React Router path
 *   - roles:  (optional) further restrict the item to a subset of the section roles
 */

export const getSidebarMenu = (role) => {
  const allMenus = [
    // ─── Main ────────────────────────────────────────────────────────────────
    {
      section: 'Main',
      roles: ['student', 'teacher', 'principal', 'admin', 'coordinator', 'cashier'],
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'MdDashboard',
          path: '/dashboard',
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'MdSettings',
          path: '/settings',
        },
      ],
    },

    // ─── Academic ────────────────────────────────────────────────────────────
    {
      section: 'Academic',
      roles: ['student', 'teacher', 'principal', 'admin', 'coordinator'],
      items: [
        {
          id: 'timetable',
          label: 'Timetable',
          icon: 'MdSchedule',
          path: '/academic/timetable',
        },
        {
          id: 'attendance',
          label: 'Attendance',
          icon: 'MdCheckCircle',
          path: '/academic/attendance',
        },
        {
          id: 'question-bank',
          label: 'Question Bank',
          icon: 'MdQuiz',
          path: '/academic/question-bank',
          roles: ['teacher', 'principal', 'admin'],
        },
        {
          id: 'lesson-plan',
          label: 'Lesson Plan',
          icon: 'MdBook',
          path: '/academic/lesson-plan',
          roles: ['teacher'],
        },
      ],
    },

    // ─── Student Services ────────────────────────────────────────────────────
    {
      section: 'Student Services',
      roles: ['student'],
      items: [
        {
          id: 'fees',
          label: 'Fee Management',
          icon: 'MdPayment',
          path: '/fees',
        },
        {
          id: 'hostel',
          label: 'Hostel',
          icon: 'MdHotel',
          path: '/hostel',
        },
        {
          id: 'library',
          label: 'Library',
          icon: 'MdLocalLibrary',
          path: '/library',
        },
        {
          id: 'transport',
          label: 'Transport',
          icon: 'MdDirectionsBus',
          path: '/transport',
        },
        {
          id: 'certificate',
          label: 'Certificates',
          icon: 'MdSchool',
          path: '/admission/certificate',
        },
        {
          id: 'feedback',
          label: 'Feedback',
          icon: 'MdFeedback',
          path: '/feedback',
        },
        {
          id: 'complaints',
          label: 'Grievances',
          icon: 'MdReport',
          path: '/core',
        },
      ],
    },

    // ─── Management (Admin) ──────────────────────────────────────────────────
    {
      section: 'Management',
      roles: ['admin'],
      items: [
        {
          id: 'manage-students',
          label: 'Manage Students',
          icon: 'MdPeople',
          path: '/dashboard/admin/students',
        },
        {
          id: 'fees-admin',
          label: 'Fee Management',
          icon: 'MdPayment',
          path: '/dashboard/cashier',
        },
        {
          id: 'hostel-admin',
          label: 'Hostel Admin',
          icon: 'MdHotel',
          path: '/hostel',
        },
        {
          id: 'library-admin',
          label: 'Library Admin',
          icon: 'MdLocalLibrary',
          path: '/library',
        },
        {
          id: 'transport-admin',
          label: 'Transport',
          icon: 'MdDirectionsBus',
          path: '/transport',
        },
        {
          id: 'complaints-admin',
          label: 'Complaints',
          icon: 'MdReport',
          path: '/core',
        },
        {
          id: 'certificate-admin',
          label: 'Certificates',
          icon: 'MdSchool',
          path: '/admission/certificate',
        },
      ],
    },

    // ─── Oversight (Principal / Coordinator) ─────────────────────────────────
    {
      section: 'Oversight',
      roles: ['principal', 'coordinator'],
      items: [
        {
          id: 'reports',
          label: 'Reports',
          icon: 'MdBarChart',
          path: '/reports',
        },
        {
          id: 'feedback-analytics',
          label: 'Feedback',
          icon: 'MdFeedback',
          path: '/feedback',
        },
        {
          id: 'complaints-view',
          label: 'Grievances',
          icon: 'MdGavel',
          path: '/core',
        },
        {
          id: 'leave-mgmt',
          label: 'Leave Management',
          icon: 'MdCalendarToday',
          path: '/leave',
        },
      ],
    },

    // ─── HRD (Admin / Principal) ─────────────────────────────────────────────
    {
      section: 'HRD',
      roles: ['admin', 'principal'],
      items: [
        {
          id: 'hrd',
          label: 'HRD',
          icon: 'MdPeople',
          path: '/hrd',
        },
      ],
    },
  ];

  // 1. Keep only sections whose `roles` include this user's role.
  // 2. Within each kept section, keep only items whose `roles` (if defined) include this role.
  // 3. Drop sections that end up with zero items after item filtering.
  return allMenus
    .filter((section) => !section.roles || section.roles.includes(role))
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.roles || item.roles.includes(role)
      ),
    }))
    .filter((section) => section.items.length > 0);
};
