import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { registerUser } from "../services/api";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

// Auto-playing photos on the image panel (matches the landing hero).
const SLIDES = [
  "/image/products/rosepink.jpg",
  "/image/hero-bouquet.jpg",
  "/image/products/birthday.jpg",
  "/image/products/lotus.jpg",
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
    left: "-4%",
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
    right: "-5%",
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
  form: {
    padding: "56px",
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
    fontSize: "42px",
    fontWeight: 600,
    color: "#5c2436",
    margin: "0 0 8px",
  },
  subtext: { fontSize: "15px", color: "#6a5560", marginBottom: "24px" },
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
    padding: "13px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(217,184,196,0.8)",
    background: "rgba(255,255,255,0.7)",
    fontSize: "15px",
    outline: "none",
    marginBottom: "16px",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  inputError: { border: "1px solid #e57373" },
  hintText: {
    fontSize: "12px",
    color: "#8a7580",
    marginTop: "-10px",
    marginBottom: "16px",
  },
  button: {
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
    marginTop: "10px",
    marginBottom: "22px",
    boxShadow: "0 14px 30px rgba(143,58,74,0.30)",
  },
  buttonDisabled: { opacity: 0.7, cursor: "not-allowed" },
  footerText: { textAlign: "center", fontSize: "14px", color: "#6a5560" },
  loginLink: { color: "#8f3a4a", textDecoration: "none", fontWeight: 600 },
  imageContainer: { position: "relative", overflow: "hidden", minHeight: 620 },
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
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { refresh } = useWishlist();
  const { refresh: refreshCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((i) => (i + 1) % SLIDES.length), 4000);
    return () => clearInterval(id);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must include at least one lowercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must include at least one number.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) {
      return "Password must include at least one special character (e.g. ! @ # $ %).";
    }
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      refresh();
      refreshCart();

      navigate("/dashboard");
    } catch (err) {
      // This is where "an account with this email already exists" shows up
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
          <motion.div
            style={styles.form}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span style={styles.eyebrow}>Create Account</span>
            <h1 style={styles.heading}>Create your account</h1>
            <p style={styles.subtext}>
              Join Florafy and start shopping beautiful flowers.
            </p>

            {error && <div style={styles.errorBox}>{error}</div>}

            <form onSubmit={handleSignup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
              />

              <label style={styles.label}>Email Address</label>
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
              <p style={styles.hintText}>
                At least 8 characters, with uppercase, lowercase, a number, and a special character.
              </p>

              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
              />

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
              >
                {loading ? "Creating account..." : "Join Us"}
              </motion.button>
            </form>

            <p style={styles.footerText}>
              Already have an account?{" "}
              <Link to="/login" style={styles.loginLink}>
                Login
              </Link>
            </p>
          </motion.div>

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
              <p style={styles.badgeTitle}>Bloom with us</p>
              <p style={styles.badgeText}>
                Handcrafted bouquets, a custom builder, and same-day delivery await.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
