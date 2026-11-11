import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token') || localStorage.getItem('library_jwt');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    let user;
    try {
      user = JSON.parse(localStorage.getItem('library_user') || localStorage.getItem('user') || 'null');
    } catch {
      user = null;
    }
    if (user?.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
