import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SignupImage from "../assets/Login.png";
import { registerUser } from "../services/api";
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
    width: "1100px",
    background: "#edd1db",
    borderRadius: "20px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(177,135,154,.18)",
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
    padding: "60px",
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
    background: "#FFF9FB",
    fontSize: "15px",
    outline: "none",
    marginBottom: "18px",
    boxSizing: "border-box",
  },

  inputError: {
    border: "1px solid #e57373",
  },

  hintText: {
    fontSize: "12px",
    color: "#777",
    marginTop: "-12px",
    marginBottom: "18px",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#2e5d2f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "15px",
    marginBottom: "25px",
  },

  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  footerText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
  },

  loginLink: {
    color: "#2962ff",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { refresh } = useWishlist();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        <div style={styles.card}>

          <div style={styles.imageContainer}>
            <img
              src={SignupImage}
              alt="Flowers"
              style={styles.image}
            />
          </div>

          <div style={styles.form}>

            <h1 style={styles.heading}>
              Create your account
            </h1>

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

              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
              >
                {loading ? "Creating account..." : "Join Us"}
              </button>
            </form>

            <p style={styles.footerText}>
              Already have an account?{" "}
              <Link to="/login" style={styles.loginLink}>
                Login
              </Link>
            </p>

          </div>

        </div>
      </div>
    </>
  );
}