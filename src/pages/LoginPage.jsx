import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoginImage from "../assets/Login.png";
import { loginUser } from "../services/api";
import { useWishlist } from "../context/WishlistContext";

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
    width: "1000px",
    background: "#edd1db",
    borderRadius: "20px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(177, 135, 154, 0.18)",
  },

  imageContainer: {
    padding: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#FCF3F6",
  },

  image: {
    width: "100%",
    maxWidth: "450px",
    height: "550px",
    objectFit: "cover",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0,0,0,.15)",
  },

  form: {
    padding: "70px 60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  heading: {
    fontSize: "46px",
    fontWeight: "700",
    color: "#1b5e20",
    marginBottom: "10px",
  },

  subtext: {
    fontSize: "18px",
    color: "#4e6655",
    marginBottom: "20px",
  },

  errorBox: {
    background: "#fdecea",
    border: "1px solid #f5c2c0",
    color: "#c62828",
    fontSize: "14px",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  label: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#333",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "8px",
    border: "1px solid #d9b8c4",
    fontSize: "15px",
    outline: "none",
    marginBottom: "20px",
    boxSizing: "border-box",
  },

  inputError: {
    border: "1px solid #e57373",
  },

  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-10px",
    marginBottom: "25px",
  },

  forgotLink: {
    fontSize: "13px",
    color: "#d32f2f",
    textDecoration: "none",
  },

  loginBtn: {
    width: "100%",
    padding: "14px",
    background: "#2e5d2f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "25px",
  },

  loginBtnDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  socialRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "30px",
  },

  socialBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#FFF8FA",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  },

  footerText: {
    textAlign: "center",
    fontSize: "14px",
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
  const { refresh } = useWishlist();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // clear old error as soon as they start correcting it
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both your email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(formData);

      // Store the session so refreshes and other pages know who's logged in
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      refresh();

      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      // This is where "wrong email/password" and "no account with this email" show up
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

            {error && <div style={styles.errorBox}>{error}</div>}

            <form onSubmit={handleLogin}>
              <label style={styles.label}>Email address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(error ? styles.inputError : {}),
                }}
              />

              <label style={styles.label}>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(error ? styles.inputError : {}),
                }}
              />

              <div style={styles.forgotRow}>
                <a href="/forgot-password" style={styles.forgotLink}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.loginBtn,
                  ...(loading ? styles.loginBtnDisabled : {}),
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div style={styles.socialRow}>
              <button style={styles.socialBtn}>
                <GoogleIcon />
                Sign in with Google
              </button>

              <button style={styles.socialBtn}>
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