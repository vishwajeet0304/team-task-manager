import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        await API.post("/auth/signup", formData);
        alert("Signup successful. Please login.");
        setIsSignup(false);
      } else {
        const res = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Team Task Manager</h1>
        <p style={styles.subtitle}>
          {isSignup ? "Create your account" : "Login to your dashboard"}
        </p>

        {isSignup && (
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Full name"
            onChange={handleChange}
          />
        )}

        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email address"
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        {isSignup && (
          <select style={styles.input} name="role" onChange={handleChange}>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        )}

        <button style={styles.primaryButton} onClick={handleSubmit}>
          {isSignup ? "Create Account" : "Login"}
        </button>

        <button style={styles.secondaryButton} onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account? Login" : "New here? Signup"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "380px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "35px",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
  },
  title: {
    margin: 0,
    color: "#1e293b",
    fontSize: "28px",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  primaryButton: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  secondaryButton: {
    width: "100%",
    padding: "12px",
    marginTop: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#2563eb",
    cursor: "pointer",
  },
};

export default Login;