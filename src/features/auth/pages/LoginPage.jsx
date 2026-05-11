import { ArrowRight, Building2 } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "@/features/auth/components/AuthShell.jsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";

export function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname ?? "/dashboard";

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form);
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell hero>
        <Building2 size={28} />
        <h2 id="auth-title">Sign in</h2>
        <p>Use the credentials created after your organization was approved.</p>
        <form className="stacked-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email or username</span>
            <input
              name="username"
              autoComplete="username"
              value={form.username}
              required
              onChange={handleChange}
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              required
              onChange={handleChange}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="button button--primary button--wide" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
            <ArrowRight size={18} />
          </button>
        </form>
        <div className="auth-links">
          <Link to="/access-request">Request access</Link>
          <Link to="/password-setup">Set password</Link>
        </div>
    </AuthShell>
  );
}
