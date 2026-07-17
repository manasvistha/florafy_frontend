import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const location = useLocation();
  const userJson = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!userJson || !token) {
    // Remember where the user was headed so LoginPage can send them back there
    // after a successful login (see location.state.from in LoginPage.jsx).
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
