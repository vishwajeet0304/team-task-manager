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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

        alert("Login successful");

        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>{isSignup ? "Signup" : "Login"}</h1>

      {isSignup && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />
      )}

      <br />
      <br />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <br />
      <br />

      {isSignup && (
        <>
          <select name="role" onChange={handleChange}>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>

          <br />
          <br />
        </>
      )}

      <button onClick={handleSubmit}>
        {isSignup ? "Signup" : "Login"}
      </button>

      <br />
      <br />

      <button onClick={() => setIsSignup(!isSignup)}>
        Switch to {isSignup ? "Login" : "Signup"}
      </button>
    </div>
  );
}

export default Login;