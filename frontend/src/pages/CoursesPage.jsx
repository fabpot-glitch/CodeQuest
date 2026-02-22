import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './CoursesPage.css';

// Lazy load components for better performance
const CoursesDashboard = lazy(() => import('../components/courses/CoursesDashboard'));
const CourseDetails = lazy(() => import('../components/courses/CourseDetails'));
const CourseCurriculum = lazy(() => import('../components/courses/CourseCurriculum'));
const CourseLessons = lazy(() => import('../components/courses/CourseLessons'));
const CourseQuiz = lazy(() => import('../components/courses/CourseQuiz'));
const CourseAssignment = lazy(() => import('../components/courses/CourseAssignment'));
const CourseCertificate = lazy(() => import('../components/courses/CourseCertificate'));
const MyLearning = lazy(() => import('../components/courses/MyLearning'));
const CourseProgress = lazy(() => import('../components/courses/CourseProgress'));
const CourseReviews = lazy(() => import('../components/courses/CourseReviews'));
const CourseInstructor = lazy(() => import('../components/courses/CourseInstructor'));
const CourseRecommendations = lazy(() => import('../components/courses/CourseRecommendations'));
const CourseSearch = lazy(() => import('../components/courses/CourseSearch'));
const CourseFilters = lazy(() => import('../components/courses/CourseFilters'));

// Loading Component
const PageLoader = () => (
  <div className="courses-page-loading">
    <div className="loading-spinner"></div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Courses Page Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="courses-page-error">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>We're having trouble loading this page. Please try again.</p>
          <div className="error-actions">
            <button 
              className="retry-btn" 
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
            <button 
              className="home-btn" 
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Breadcrumb Component
const CoursesBreadcrumb = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const courseIndex = pathnames.indexOf('courses');
    
    if (courseIndex === -1 || pathnames.length <= courseIndex + 1) {
      setBreadcrumbs([]);
      return;
    }

    const crumbs = [];
    crumbs.push({ name: 'Dashboard', path: '/dashboard' });
    crumbs.push({ name: 'Courses', path: '/dashboard/courses' });

    const courseId = pathnames[courseIndex + 1];
    if (courseId && !isNaN(courseId)) {
      crumbs.push({ 
        name: 'Course Details', 
        path: `/dashboard/courses/${courseId}`,
        active: pathnames.length === courseIndex + 2
      });
    }

    if (pathnames.length > courseIndex + 2) {
      const section = pathnames[courseIndex + 2];
      let name = '';
      switch(section) {
        case 'learn':
          name = 'Learning';
          break;
        case 'quiz':
          name = 'Quiz';
          break;
        case 'assignment':
          name = 'Assignment';
          break;
        case 'certificate':
          name = 'Certificate';
          break;
        case 'progress':
          name = 'Progress';
          break;
        case 'reviews':
          name = 'Reviews';
          break;
        case 'instructor':
          name = 'Instructor';
          break;
        default:
          name = section;
      }
      crumbs.push({ 
        name, 
        path: location.pathname,
        active: true 
      });
    }

    setBreadcrumbs(crumbs);
  }, [location]);

  if (breadcrumbs.length === 0) return null;

  return (
    <div className="courses-breadcrumb">
      <ul className="breadcrumb-list">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <li className="breadcrumb-separator">/</li>}
            <li className={`breadcrumb-item ${crumb.active ? 'active' : ''}`}>
              {crumb.active ? (
                crumb.name
              ) : (
                <a href={crumb.path}>{crumb.name}</a>
              )}
            </li>
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

const CoursesPage = () => {
  return (
    <ErrorBoundary>
      <div className="courses-page">
        <CoursesBreadcrumb />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main Courses Dashboard */}
            <Route index element={<CoursesDashboard />} />
            
            {/* Course Details */}
            <Route path=":courseId" element={<CourseDetails />} />
            
            {/* Course Learning Path */}
            <Route path=":courseId/learn" element={<CourseCurriculum />} />
            
            {/* Course Lessons */}
            <Route path=":courseId/lessons/:lessonId" element={<CourseLessons />} />
            
            {/* Course Quizzes */}
            <Route path=":courseId/quiz/:quizId" element={<CourseQuiz />} />
            
            {/* Course Assignments */}
            <Route path=":courseId/assignment/:assignmentId" element={<CourseAssignment />} />
            
            {/* Course Certificate */}
            <Route path=":courseId/certificate" element={<CourseCertificate />} />
            
            {/* Course Progress */}
            <Route path=":courseId/progress" element={<CourseProgress />} />
            
            {/* Course Reviews */}
            <Route path=":courseId/reviews" element={<CourseReviews />} />
            
            {/* Course Instructor */}
            <Route path=":courseId/instructor" element={<CourseInstructor />} />
            
            {/* My Learning */}
            <Route path="my-learning" element={<MyLearning />} />
            
            {/* Recommendations */}
            <Route path="recommendations" element={<CourseRecommendations />} />
            
            {/* Search */}
            <Route path="search" element={<CourseSearch />} />
            
            {/* Filters */}
            <Route path="filters" element={<CourseFilters />} />
            
            {/* Redirect any unknown paths to courses dashboard */}
            <Route path="*" element={<Navigate to="/dashboard/courses" replace />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default CoursesPage;