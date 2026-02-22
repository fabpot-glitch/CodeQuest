// src/pages/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f4f8",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "2px solid #3b82f6", // Blue border
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1e3a8a" }}>
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "2px solid #3b82f6",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#1d4ed8"}
            onBlur={(e) => e.target.style.borderColor = "#3b82f6"}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#3b82f6",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#1d4ed8"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "20px", textAlign: "center", color: "#1e3a8a", fontWeight: "500" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
