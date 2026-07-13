import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const userJson = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!userJson || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}