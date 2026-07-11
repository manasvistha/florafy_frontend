import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoginImage from "../assets/Login.png";

const styles = {
  page: {
    minHeight: "calc(100vh - 80px)",
    background: "#f7e9ee",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
  },

  card: {
    width: "820px",
    maxWidth: "95%",
    background: "#edd1db",
    borderRadius: "16px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(177, 135, 154, 0.18)",
  },

  imageContainer: {
    padding: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#FCF3F6",
  },

  image: {
    width: "100%",
    maxWidth: "320px",
    height: "420px",
    objectFit: "cover",
    borderRadius: "14px",
    boxShadow: "0 8px 25px rgba(0,0,0,.15)",
  },

  form: {
    padding: "48px 42px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  heading: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1b5e20",
    marginBottom: "8px",
  },

  subtext: {
    fontSize: "14px",
    color: "#4e6655",
    marginBottom: "24px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#333",
  },

  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1px solid #d9b8c4",
    fontSize: "14px",
    outline: "none",
    marginBottom: "14px",
    boxSizing: "border-box",
  },

  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-6px",
    marginBottom: "18px",
  },

  forgotLink: {
    fontSize: "12px",
    color: "#d32f2f",
    textDecoration: "none",
  },

  loginBtn: {
    width: "100%",
    padding: "12px",
    background: "#2e5d2f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "18px",
  },

  socialRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "22px",
  },

  socialBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#FFF8FA",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "13px",
  },

  footerText: {
    textAlign: "center",
    fontSize: "13px",
    color: "#555",
  },

  signUpLink: {
    color: "#2962ff",
    textDecoration: "none",
    fontWeight: "600",
  },
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.3 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.6 5.1C9.6 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.6 5.4C40.9 36.6 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 384 512" fill="black">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 37 59 127.6 107.2 126.1 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-83.5 102.6-120.6-65.2-30.7-61.7-90-61.7-91.5zM256.7 88.5c26.9-32 24.5-61.2 23.7-71.7-23.8 1.4-51.3 16.4-67 34.9-17.3 19.8-27.5 44.3-25.3 71.2 25.5 2 48.8-11 68.6-34.4z"/>
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: replace with real authentication call once the backend is wired up
    navigate("/dashboard");
  };

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.card}>

          <div style={styles.imageContainer}>
            <img
              src={LoginImage}
              alt="Flowers"
              style={styles.image}
            />
          </div>

          <div style={styles.form}>

            <h1 style={styles.heading}>Welcome back</h1>

            <p style={styles.subtext}>
              Welcome back! Please enter your details.
            </p>

            <label style={styles.label}>Email address</label>

            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
            />

            <label style={styles.label}>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              style={styles.input}
            />

            <div style={styles.forgotRow}>
              <a href="/forgot-password" style={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            <button style={styles.loginBtn} onClick={handleLogin}>
              Login
            </button>

            <div style={styles.socialRow}>
              <button style={styles.socialBtn} onClick={handleLogin}>
                <GoogleIcon />
                Sign in with Google
              </button>

              <button style={styles.socialBtn} onClick={handleLogin}>
                <AppleIcon />
                Sign in with Apple
              </button>
            </div>

            <p style={styles.footerText}>
              Don't have an account?{" "}
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