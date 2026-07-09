import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const styles = {
  page: {
    minHeight: 'calc(100vh - 104px)',
    background: '#f7e9ee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 64,
    maxWidth: 1000,
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 420,
    objectFit: 'cover',
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
  heading: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2f4a3a',
    margin: '0 0 8px',
  },
  subtext: {
    fontSize: 14,
    color: '#2f4a3a',
    margin: '0 0 32px',
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#2a2420',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #d9b8c4',
    background: '#fff',
    fontSize: 14,
    outline: 'none',
    marginBottom: 16,
  },
  forgotRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: -12,
    marginBottom: 20,
  },
  forgotLink: {
    fontSize: 12,
    color: '#6d2b3a',
    textDecoration: 'none',
  },
  loginBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: 8,
    border: 'none',
    background: '#2f4a3a',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 20,
  },
  socialRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 24,
  },
  socialBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #ddd',
    background: '#fff',
    fontSize: 13,
    fontWeight: 500,
    color: '#2a2420',
    cursor: 'pointer',
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#2a2420',
  },
  signUpLink: {
    color: '#3b5bdb',
    textDecoration: 'none',
    fontWeight: 500,
  },
};

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.3 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.6 5.1C9.6 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.6 5.4C40.9 36.6 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 384 512" fill="#000">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 37 59 127.6 107.2 126.1 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-83.5 102.6-120.6-65.2-30.7-61.7-90-61.7-91.5zM256.7 88.5c26.9-32 24.5-61.2 23.7-71.7-23.8 1.4-51.3 16.4-67 34.9-17.3 19.8-27.5 44.3-25.3 71.2 25.5 2 48.8-11 68.6-34.4z"/>
    </svg>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.card}>
        <img
          src={require('../assets/Login.png')}
          alt="Woman holding a bouquet of white and pink roses"
          style={styles.image}
        />

        <div>
          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.subtext}>Welcome back! Please enter your details</p>

          <label style={styles.label} htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            style={styles.input}
          />

          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            style={styles.input}
          />

          <div style={styles.forgotRow}>
            <a href="/forgot-password" style={styles.forgotLink}>
              Forgot password
            </a>
          </div>

          <button style={styles.loginBtn}>Login</button>

          <div style={styles.socialRow}>
            <button style={styles.socialBtn}>
              <GoogleIcon /> Sign in with Google
            </button>
            <button style={styles.socialBtn}>
              <AppleIcon /> Sign in with Apple
            </button>
          </div>

          <p style={styles.footerText}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" style={styles.signUpLink}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      </div>
    </>
  );
}