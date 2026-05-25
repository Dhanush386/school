import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">Loading...</p>
    </div>
  </div>
);

// ── Auth
const Login          = lazy(() => import('../pages/auth/Login'));
const Signup         = lazy(() => import('../pages/auth/Signup'));
const ChangePassword = lazy(() => import('../pages/auth/ChangePassword'));

// ── Public
const LandingPage    = lazy(() => import('../pages/public/LandingPage'));
const AicteIdeaLab   = lazy(() => import('../pages/public/AicteIdeaLab'));
const AboutUs        = lazy(() => import('../pages/public/AboutUs'));
const VisionMission  = lazy(() => import('../pages/public/VisionMission'));
const Academics      = lazy(() => import('../pages/public/Academics'));
const Administration = lazy(() => import('../pages/public/Administration'));
const Facilities     = lazy(() => import('../pages/public/Facilities'));
const OnlinePayment  = lazy(() => import('../pages/public/OnlinePayment'));

// ── Dashboards
const StudentDashboard     = lazy(() => import('../pages/dashboard/student/StudentDashboard'));
const TeacherDashboard     = lazy(() => import('../pages/dashboard/teacher/TeacherDashboard'));
const PrincipalDashboard   = lazy(() => import('../pages/dashboard/principal/PrincipalDashboard'));
const AdminDashboard       = lazy(() => import('../pages/dashboard/admin/AdminDashboard'));
const CoordinatorDashboard = lazy(() => import('../pages/dashboard/coordinator/CoordinatorDashboard'));

// ── Academic
const QuestionBank = lazy(() => import('../pages/academic/QuestionBank'));
const Timetable    = lazy(() => import('../pages/academic/Timetable'));
const Attendance   = lazy(() => import('../pages/academic/Attendance'));
const Assignments  = lazy(() => import('../pages/academic/Assignments'));
const LessonPlan   = lazy(() => import('../pages/academic/LessonPlan'));

// ── Modules
const FeeOverview        = lazy(() => import('../pages/fees/FeeOverview'));
const HostelApplication  = lazy(() => import('../pages/hostel/HostelApplication'));
const LibraryPage        = lazy(() => import('../pages/library/LibraryPage'));
const RouteView          = lazy(() => import('../pages/transport/RouteView'));
const SubmitFeedback     = lazy(() => import('../pages/feedback/SubmitFeedback'));
const ComplaintTracker   = lazy(() => import('../pages/core/ComplaintTracker'));
const CertificateRequest = lazy(() => import('../pages/admission/CertificateRequest'));
const HRDPage            = lazy(() => import('../pages/hrd/HRDPage'));
const ReportsPage        = lazy(() => import('../pages/reports/ReportsPage'));
const LeavePage          = lazy(() => import('../pages/leave/LeavePage'));
const SettingsPage       = lazy(() => import('../pages/settings/SettingsPage'));
const NotFoundPage       = lazy(() => import('../pages/NotFoundPage'));

// ── Renders the correct dashboard for each role
const DashboardRouter = () => {
  const { user } = useAuth();
  const map = {
    student:     <StudentDashboard />,
    teacher:     <TeacherDashboard />,
    principal:   <PrincipalDashboard />,
    admin:       <AdminDashboard />,
    coordinator: <CoordinatorDashboard />,
    hod:         <CoordinatorDashboard />,
  };
  return map[user?.role] || <Navigate to="/login" replace />;
};

const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* ── Public */}
      <Route path="/"                element={<LandingPage />} />
      <Route path="/aicte-idea-lab"  element={<AicteIdeaLab />} />
      <Route path="/about-us"        element={<AboutUs />} />
      <Route path="/vision-mission"  element={<VisionMission />} />
      <Route path="/academics"       element={<Academics />} />
      <Route path="/administration"  element={<Administration />} />
      <Route path="/facilities"      element={<Facilities />} />
      <Route path="/online-payment"  element={<OnlinePayment />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/signup"          element={<Signup />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* ── Protected — all authenticated roles */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardRouter />} />

        {/* Academic */}
        <Route path="/academic/timetable"     element={<Timetable />} />
        <Route path="/academic/attendance"    element={<Attendance />} />
        <Route path="/academic/question-bank" element={<QuestionBank />} />
        <Route path="/academic/assignments"   element={<Assignments />} />
        <Route path="/academic/lesson-plan"   element={<LessonPlan />} />

        {/* Modules */}
        <Route path="/fees"                  element={<FeeOverview />} />
        <Route path="/hostel"                element={<HostelApplication />} />
        <Route path="/library"               element={<LibraryPage />} />
        <Route path="/transport"             element={<RouteView />} />
        <Route path="/feedback"              element={<SubmitFeedback />} />
        <Route path="/core"                  element={<ComplaintTracker />} />
        <Route path="/admission/certificate" element={<CertificateRequest />} />
        <Route path="/leave"                 element={<LeavePage />} />
        <Route path="/settings"              element={<SettingsPage />} />
      </Route>

      {/* ── Reports — principal / coordinator / admin */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'principal', 'coordinator']} />}>
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      {/* ── HRD — admin / principal only */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'principal']} />}>
        <Route path="/hrd" element={<HRDPage />} />
      </Route>

      {/* ── 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRouter;
