import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { loginUser } from "../services/api";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

// Auto-playing photos on the image panel (matches the landing hero).
const SLIDES = [
  "/image/hero-bouquet.jpg",
  "/image/products/rose.jpg",
  "/image/products/mixed.jpg",
  "/image/products/rosepink.jpg",
];

const styles = {
  page: {
    minHeight: "calc(100vh - 80px)",
    background:
      "linear-gradient(160deg, #f7e9ee 0%, #fbeef2 45%, #f4dce4 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    width: 420,
    height: 420,
    top: "-10%",
    right: "-4%",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,111,134,0.25), transparent 70%)",
    filter: "blur(30px)",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    width: 360,
    height: 360,
    bottom: "-8%",
    left: "-5%",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(233,188,203,0.4), transparent 70%)",
    filter: "blur(30px)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 2,
    width: "1040px",
    maxWidth: "100%",
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(22px)",
    WebkitBackdropFilter: "blur(22px)",
    border: "1px solid rgba(255,255,255,0.7)",
    borderRadius: "28px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    overflow: "hidden",
    boxShadow: "0 30px 70px rgba(92,36,54,0.18)",
  },
  imageContainer: { position: "relative", overflow: "hidden", minHeight: 560 },
  slide: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(42,18,24,0.10) 40%, rgba(42,18,24,0.45) 100%)",
  },
  imageBadge: {
    position: "absolute",
    bottom: 26,
    left: 26,
    right: 26,
    padding: "16px 20px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.68)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.85)",
    boxShadow: "0 12px 30px rgba(92,36,54,0.16)",
  },
  badgeTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontSize: 22,
    fontWeight: 600,
    color: "#5c2436",
    margin: "0 0 3px",
  },
  badgeText: { fontSize: 12.5, color: "#6a5560", margin: 0 },
  form: {
    padding: "64px 56px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#8f3a4a",
    marginBottom: 12,
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontSize: "44px",
    fontWeight: 600,
    color: "#5c2436",
    margin: "0 0 8px",
  },
  subtext: { fontSize: "15px", color: "#6a5560", marginBottom: "26px" },
  errorBox: {
    background: "rgba(253,236,234,0.9)",
    border: "1px solid #f5c2c0",
    color: "#c62828",
    fontSize: "14px",
    padding: "10px 14px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  label: {
    fontSize: "13.5px",
    fontWeight: 600,
    marginBottom: "8px",
    color: "#4a3b40",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(217,184,196,0.8)",
    background: "rgba(255,255,255,0.7)",
    fontSize: "15px",
    outline: "none",
    marginBottom: "20px",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  inputError: { border: "1px solid #e57373" },
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-10px",
    marginBottom: "24px",
  },
  forgotLink: { fontSize: "13px", color: "#8f3a4a", textDecoration: "none", fontWeight: 500 },
  loginBtn: {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(135deg, #c96f86 0%, #8f3a4a 55%, #5c2436 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: 0.5,
    cursor: "pointer",
    marginBottom: "24px",
    boxShadow: "0 14px 30px rgba(143,58,74,0.30)",
  },
  loginBtnDisabled: { opacity: 0.7, cursor: "not-allowed" },
  socialRow: { display: "flex", gap: "12px", marginBottom: "28px" },
  socialBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.8)",
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "13.5px",
    color: "#4a3b40",
  },
  footerText: { textAlign: "center", fontSize: "14px", color: "#6a5560" },
  signUpLink: { color: "#8f3a4a", textDecoration: "none", fontWeight: 600 },
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
  const location = useLocation();
  const { refresh } = useWishlist();
  const { refresh: refreshCart } = useCart();

  // Where RequireAuth wanted to send us before it bounced us to /login.
  const redirectTo = location.state?.from?.pathname;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((i) => (i + 1) % SLIDES.length), 4000);
    return () => clearInterval(id);
  }, []);

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
      refreshCart();

      // If we were redirected here from a protected page, go back to it.
      // Otherwise fall back to the role's default landing page.
      const defaultPath = data.user.role === "admin" ? "/admin" : "/dashboard";
      navigate(redirectTo || defaultPath, { replace: true });
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
        <div style={styles.blob1} />
        <div style={styles.blob2} />

        <motion.div
          style={styles.card}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div style={styles.imageContainer}>
            <AnimatePresence>
              <motion.div
                key={slide}
                style={{ ...styles.slide, backgroundImage: `url(${SLIDES[slide]})` }}
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 1.1 }, scale: { duration: 4.5, ease: "easeOut" } }}
              />
            </AnimatePresence>
            <div style={styles.imageOverlay} />
            <motion.div
              style={styles.imageBadge}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p style={styles.badgeTitle}>Welcome back to Florafy</p>
              <p style={styles.badgeText}>
                Your bouquets, wishlist and orders are right where you left them.
              </p>
            </motion.div>
          </div>

          <motion.div
            style={styles.form}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span style={styles.eyebrow}>Sign In</span>
            <h1 style={styles.heading}>Welcome back</h1>
            <p style={styles.subtext}>Welcome back! Please enter your details.</p>

            {error && <div style={styles.errorBox}>{error}</div>}

            <form onSubmit={handleLogin}>
              <label style={styles.label}>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
              />

              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
              />

              <div style={styles.forgotRow}>
                <a href="/forgot-password" style={styles.forgotLink}>
                  Forgot password?
                </a>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{ ...styles.loginBtn, ...(loading ? styles.loginBtnDisabled : {}) }}
              >
                {loading ? "Logging in..." : "Login"}
              </motion.button>
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
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
