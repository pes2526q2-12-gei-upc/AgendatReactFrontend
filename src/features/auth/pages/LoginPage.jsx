import { ArrowRight, Building2 } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "@/features/auth/components/AuthShell.jsx";
import { useAuth } from "@/features/auth/context/useAuth.js";
import { TextField } from "@/shared/ui/FormControls/FormControls.jsx";

function validateForm(form) {
  const errors = {};

  if (!form.organizationName.trim()) {
    errors.organizationName = "Enter your organization name.";
  }

  if (!form.password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function LoginPage() {
  const [form, setForm] = useState({ organizationName: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname ?? "/dashboard";

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setFieldErrors((current) => {
      if (!current[event.target.name]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[event.target.name];
      return nextErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const nextFieldErrors = validateForm(form);

    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await login({
        username: form.organizationName.trim(),
        password: form.password,
      });
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
      <h2 id="auth-title">Sign In</h2>
      <p>Sign in with your organization name and password.</p>
      <form className="stacked-form" noValidate onSubmit={handleSubmit}>
        <TextField
          label="Organization Name"
          name="organizationName"
          autoComplete="username"
          value={form.organizationName}
          required
          error={fieldErrors.organizationName}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          required
          error={fieldErrors.password}
          onChange={handleChange}
        />
        {error ? <p className="form-error">{error}</p> : null}
        <button
          className="button button--primary button--wide"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
          <ArrowRight size={18} />
        </button>
      </form>
      <div className="auth-links">
        <Link to="/access-request">Request access</Link>
        <Link to="/password-setup">Set password</Link>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </AuthShell>
  );
}
