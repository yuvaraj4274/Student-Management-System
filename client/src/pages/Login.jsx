import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <div className="auth-side-top">
          <div className="auth-side-mark">SM</div>
          <strong>Student Records</strong>
        </div>

        <div className="auth-side-mid">
          <h2>Every student record, course, and enrollment in one place.</h2>
          <p>
            Sign in to add students, manage courses, and keep track of enrollment
            across every class you run.
          </p>
        </div>

        <div className="auth-side-stats">
          <div>
            <strong>MongoDB</strong>
            <span>Database</span>
          </div>
          <div>
            <strong>Express</strong>
            <span>API layer</span>
          </div>
          <div>
            <strong>React</strong>
            <span>Interface</span>
          </div>
          <div>
            <strong>Node.js</strong>
            <span>Runtime</span>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-box">
          <h1>Admin login</h1>
          <p>Enter your credentials to access the dashboard.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.com"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="auth-hint">
            First time here? Run <code>npm run seed</code> in the server folder to create
            the default admin account, then sign in with the email and password from your
            <code> .env</code> file.
          </div>
        </div>
      </div>
    </div>
  );
}
