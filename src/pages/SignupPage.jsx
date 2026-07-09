import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SignupImage from "../assets/Login.png";

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
    marginBottom: "30px",
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

            <label style={styles.label}>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              style={styles.input}
            />

            <label style={styles.label}>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
            />

            <label style={styles.label}>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              style={styles.input}
            />

            <label style={styles.label}>
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              style={styles.input}
            />

            <button style={styles.button}>
              Join Us
            </button>

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