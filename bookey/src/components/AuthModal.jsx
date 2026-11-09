import { useState } from "react";

function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const endpoint =
      mode === "login"
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication request failed.");
      }

      if (mode === "register") {
        setSuccessMessage("Account created successfully! Please sign in.");
        setMode("login");
        setFormData({ ...formData, password: "" });
      } else {
        // Login success: save token and user info
        localStorage.setItem("bookey_token", data.token);
        localStorage.setItem("bookey_user", JSON.stringify(data.user));
        if (onAuthSuccess) {
          onAuthSuccess(data.user, data.token);
        }
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || "Could not connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="auth-modal__header">
          <span className="auth-seal">★</span>
          <h2 className="auth-title">
            {mode === "login" ? "Welcome Back to Bookey" : "Join the Literary Archive"}
          </h2>
          <p className="auth-subtitle">
            {mode === "login"
              ? "Sign in to manage your collection and access secure orders."
              : "Register an account for expedited checkout across all 58 Wilayas."}
          </p>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === "login" ? "auth-tab--active" : ""}`}
              onClick={() => switchMode("login")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === "register" ? "auth-tab--active" : ""}`}
              onClick={() => switchMode("register")}
            >
              Register
            </button>
          </div>
        </div>

        {errorMessage && <div className="auth-alert auth-alert--error">{errorMessage}</div>}
        {successMessage && <div className="auth-alert auth-alert--success">{successMessage}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="form-group">
              <label htmlFor="auth-name" className="form-label">
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Amina Benali"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email" className="form-label">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              name="email"
              className="form-input"
              placeholder="e.g. reader@ensta.dz"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password" className="form-label">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Processing..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        <div className="auth-modal__footer">
          {mode === "login" ? (
            <p>
              Don't have an account yet?{" "}
              <button type="button" className="auth-link-btn" onClick={() => switchMode("register")}>
                Create one here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button type="button" className="auth-link-btn" onClick={() => switchMode("login")}>
                Sign in to your account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
