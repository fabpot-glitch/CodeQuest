import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected content
  console.log('ProtectedRoute: User authenticated:', user);
  return children;
};

export default ProtectedRoute;