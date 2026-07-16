import { Navigate } from 'react-router-dom';

// Inverse of RequireAuth: if a valid session already exists, send the user
// straight into the app instead of showing the landing / login / signup pages.
// This is why an already-logged-in user no longer sees the login options after
// restarting the dev server or reopening the app.
function getSessionUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    return token && user ? user : null;
  } catch {
    return null;
  }
}

export default function RedirectIfAuthed({ children }) {
  const user = getSessionUser();

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}
