// ============================================================
// AuthPage.js — Login and Register
//
// Same tabbed approach as the Task Manager — two tabs in one page.
// On success, calls onLogin(user, token) which is handled in App.js.
// ============================================================

import React, { useState } from "react";

function AuthPage({ onLogin }) {
  const [tab,      setTab]      = useState("login");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = tab === "register"
      ? { name, email, password }
      : { email, password };

    try {
      const res  = await fetch(`https://e-commerce-web-l75s.onrender.com/api/auth/${tab}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      onLogin(data.user, data.token);

    } catch (err) {
      setError("Cannot reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-logo">🛒 ShopEasy</div>
        <p className="auth-subtitle">
          {tab === "login" ? "Log in to your account" : "Create a new account"}
        </p>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setError(""); }}
          >
            Log In
          </button>
          <button
            className={`auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => { setTab("register"); setError(""); }}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          {tab === "register" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>

          {error && <p className="form-error">⚠️ {error}</p>}

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading ? "Please wait..." : tab === "login" ? "Log In" : "Create Account"}
          </button>

        </form>

        <p className="auth-switch">
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <button className="auth-switch-btn" onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}>
            {tab === "login" ? "Register here" : "Log in here"}
          </button>
        </p>

      </div>
    </div>
  );
}

export default AuthPage;
