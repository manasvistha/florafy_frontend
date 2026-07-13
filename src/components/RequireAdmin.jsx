import { Navigate } from 'react-router-dom';

// Route guard: only accounts with role "admin" (from the stored login response)
// may see admin pages. Everyone else is bounced to login. The backend enforces
// this too — this is just so non-admins don't see the UI at all.
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
}

export default function RequireAdmin({ children }) {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
