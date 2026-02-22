import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ================= CONTEXT =================
import { ResumeProvider } from './context/ResumeContext';

// ================= LAYOUT =================
import DashboardLayout from './layouts/DashboardLayout';

// ================= PUBLIC PAGES =================
import LandingPage from './pages/Landingpage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// ================= DASHBOARD PAGES =================
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Problems from './pages/Problems';
import SearchProblems from './pages/SearchProblems';
import ProblemDetail from './pages/ProblemDetail';
import ProblemSolver from './pages/ProblemSolver';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import SubmissionsPage from './pages/SubmissionsPage';

// ================= CONTESTS =================
import ContestsPage from './pages/ContestsPage';  // Import the new ContestsPage

// ================= MOCK INTERVIEW =================
import MockInterviewDashboard from './pages/MockInterviewDashboard';
import InterviewPreparation from './components/mockinterviews/01_Interview-Preparation/InterviewPreparation';
import PreparationChecklist from './components/mockinterviews/01_Interview-Preparation/PreparationChecklist';
import ResumeReview from './components/mockinterviews/01_Interview-Preparation/ResumeReview';

// ================= PRACTICE SESSIONS =================
import PracticeSessionsDashboard from './components/02_Practice-Sessions/PracticeSessionsDashboard';
import SessionBooking from './components/02_Practice-Sessions/SessionBooking';
import ScheduledSessions from './components/02_Practice-Sessions/ScheduledSessions';
import SessionTypes from './components/02_Practice-Sessions/SessionTypes';
import TechnicalTemplate from './components/02_Practice-Sessions/TechnicalTemplate';
import PracticeSessionsPage from './pages/PracticeSessionsPage';

// ================= SESSION RECORDINGS =================
import RecordingsDashboard from './components/03_Recordings/RecordingsDashboard';
import RecordingPlayer from './components/03_Recordings/RecordingPlayer';
import RecordingList from './components/03_Recordings/RecordingList';
import RecordingCard from './components/03_Recordings/RecordingCard';
import RecordingFilters from './components/03_Recordings/RecordingFilters';
import RecordingAnalytics from './components/03_Recordings/RecordingAnalytics';

// ================= PERFORMANCE TRACKING =================
import PerformanceDashboard from './components/04_PerformanceTracking/PerformanceDashboard';
import Analytics from './components/04_PerformanceTracking/Analytics';
import Goals from './components/04_PerformanceTracking/Goals';
import Milestones from './components/04_PerformanceTracking/Milestones';
import ProgressTracker from './components/04_PerformanceTracking/ProgressTracker';
import Reports from './components/04_PerformanceTracking/Reports';

// ================= COURSES =================
import CoursesPage from './pages/CoursesPage';
import CoursesDashboard from './components/courses/CoursesDashboard';
import CourseDetails from './components/courses/CourseDetails';
import CourseCurriculum from './components/courses/CourseCurriculum';
import CourseLessons from './components/courses/CourseLessons';
import CourseQuiz from './components/courses/CourseQuiz';
import CourseAssignment from './components/courses/CourseAssignment';
import CourseCertificate from './components/courses/CourseCertificate';
import MyLearning from './components/courses/MyLearning';
import CourseProgress from './components/courses/CourseProgress';
import CourseReviews from './components/courses/CourseReviews';
import CourseInstructor from './components/courses/CourseInstructor';
import CourseRecommendations from './components/courses/CourseRecommendations';
import CourseSearch from './components/courses/CourseSearch';
import CourseFilters from './components/courses/CourseFilters';

// ================= RESUME BUILDER =================
import BuilderPage from './pages/BuilderPage';
import PreviewPage from './pages/PreviewPage';
import ExportPage from './pages/ExportPage';

// ================= LOADING =================
import LoadingSpinner from './components/LoadingSpinner';

// ================= AUTH =================
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

// ================= APP =================
function App() {
  return (
    <ResumeProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="home" element={<Home />} />

              {/* Problems */}
              <Route path="problems">
                <Route index element={<Problems />} />
                <Route path="search" element={<SearchProblems />} />
                <Route path=":id" element={<ProblemDetail />} />
                <Route path=":id/solve" element={<ProblemSolver />} />
              </Route>

              {/* User */}
              <Route path="submissions" element={<SubmissionsPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="leaderboard" element={<Leaderboard />} />

              {/* CONTESTS - UPDATED SECTION */}
              <Route path="contests/*" element={<ContestsPage />} />

              {/* MOCK INTERVIEWS */}
              <Route path="mockinterviews">
                <Route index element={<MockInterviewDashboard />} />

                <Route path="preparation" element={<InterviewPreparation />} />
                <Route path="checklist" element={<PreparationChecklist />} />
                <Route path="resume-review" element={<ResumeReview />} />

                {/* Practice Sessions */}
                <Route path="practice">
                  <Route index element={<PracticeSessionsDashboard />} />
                  <Route path="sessions" element={<PracticeSessionsPage />} />
                  <Route path="book/:sessionId" element={<SessionBooking />} />
                  <Route path="scheduled" element={<ScheduledSessions />} />
                  <Route path="types" element={<SessionTypes />} />
                  <Route path="technical/:problemId" element={<TechnicalTemplate />} />
                </Route>

                {/* Session Recordings */}
                <Route path="recordings">
                  <Route index element={<RecordingsDashboard />} />
                  <Route path=":recordingId" element={<RecordingPlayer />} />
                  <Route path="list" element={<RecordingList />} />
                  <Route path="card" element={<RecordingCard />} />
                  <Route path="filters" element={<RecordingFilters />} />
                  <Route path="analytics" element={<RecordingAnalytics />} />
                </Route>

                {/* Performance Tracking */}
                <Route path="performance">
                  <Route index element={<PerformanceDashboard />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="goals" element={<Goals />} />
                  <Route path="milestones" element={<Milestones />} />
                  <Route path="progress" element={<ProgressTracker />} />
                  <Route path="reports" element={<Reports />} />
                </Route>
              </Route>

              {/* COURSES */}
              <Route path="courses">
                <Route index element={<CoursesDashboard />} />
                <Route path=":courseId" element={<CourseDetails />} />
                <Route path=":courseId/learn" element={<CourseCurriculum />} />
                <Route path=":courseId/lessons/:lessonId" element={<CourseLessons />} />
                <Route path=":courseId/quiz/:quizId" element={<CourseQuiz />} />
                <Route path=":courseId/assignment/:assignmentId" element={<CourseAssignment />} />
                <Route path=":courseId/certificate" element={<CourseCertificate />} />
                <Route path=":courseId/progress" element={<CourseProgress />} />
                <Route path=":courseId/reviews" element={<CourseReviews />} />
                <Route path=":courseId/instructor" element={<CourseInstructor />} />
                <Route path="my-learning" element={<MyLearning />} />
                <Route path="recommendations" element={<CourseRecommendations />} />
                <Route path="search" element={<CourseSearch />} />
                <Route path="filters" element={<CourseFilters />} />
              </Route>

              {/* Resume Builder */}
              <Route path="resume-builder">
                <Route index element={<BuilderPage />} />
                <Route path="preview" element={<PreviewPage />} />
                <Route path="export" element={<ExportPage />} />
              </Route>

              <Route path="resume-preview" element={<Navigate to="/dashboard/resume-builder/preview" replace />} />
              <Route path="resume-export" element={<Navigate to="/dashboard/resume-builder/export" replace />} />
            </Route>

            {/* Standalone Resume Builder */}
            <Route path="/resume-builder" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
            <Route path="/resume-builder/preview" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
            <Route path="/resume-builder/export" element={<ProtectedRoute><ExportPage /></ProtectedRoute>} />

            {/* Standalone Recordings Routes */}
            <Route path="/recordings" element={<ProtectedRoute><RecordingsDashboard /></ProtectedRoute>} />
            <Route path="/recordings/:recordingId" element={<ProtectedRoute><RecordingPlayer /></ProtectedRoute>} />
            <Route path="/recordings/card" element={<ProtectedRoute><RecordingCard /></ProtectedRoute>} />
            <Route path="/recordings/list" element={<ProtectedRoute><RecordingList /></ProtectedRoute>} />
            <Route path="/recordings/filters" element={<ProtectedRoute><RecordingFilters /></ProtectedRoute>} />
            <Route path="/recordings/analytics" element={<ProtectedRoute><RecordingAnalytics /></ProtectedRoute>} />

            {/* Standalone Performance Routes */}
            <Route path="/performance" element={<ProtectedRoute><PerformanceDashboard /></ProtectedRoute>} />
            <Route path="/performance/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/performance/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/performance/milestones" element={<ProtectedRoute><Milestones /></ProtectedRoute>} />
            <Route path="/performance/progress" element={<ProtectedRoute><ProgressTracker /></ProtectedRoute>} />
            <Route path="/performance/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

            {/* Standalone Courses Routes */}
            <Route path="/courses" element={<ProtectedRoute><CoursesDashboard /></ProtectedRoute>} />
            <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
            <Route path="/courses/:courseId/learn" element={<ProtectedRoute><CourseCurriculum /></ProtectedRoute>} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<ProtectedRoute><CourseLessons /></ProtectedRoute>} />
            <Route path="/courses/:courseId/quiz/:quizId" element={<ProtectedRoute><CourseQuiz /></ProtectedRoute>} />
            <Route path="/courses/:courseId/assignment/:assignmentId" element={<ProtectedRoute><CourseAssignment /></ProtectedRoute>} />
            <Route path="/courses/:courseId/certificate" element={<ProtectedRoute><CourseCertificate /></ProtectedRoute>} />
            <Route path="/courses/:courseId/progress" element={<ProtectedRoute><CourseProgress /></ProtectedRoute>} />
            <Route path="/courses/:courseId/reviews" element={<ProtectedRoute><CourseReviews /></ProtectedRoute>} />
            <Route path="/courses/:courseId/instructor" element={<ProtectedRoute><CourseInstructor /></ProtectedRoute>} />
            <Route path="/courses/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
            <Route path="/courses/recommendations" element={<ProtectedRoute><CourseRecommendations /></ProtectedRoute>} />
            <Route path="/courses/search" element={<ProtectedRoute><CourseSearch /></ProtectedRoute>} />
            <Route path="/courses/filters" element={<ProtectedRoute><CourseFilters /></ProtectedRoute>} />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />

          </Routes>
        </Suspense>
      </Router>
    </ResumeProvider>
  );
}

export default App;