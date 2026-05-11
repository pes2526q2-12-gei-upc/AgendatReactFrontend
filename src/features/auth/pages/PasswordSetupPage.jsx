import { KeyRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "@/features/auth/components/AuthShell.jsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";

export function PasswordSetupPage() {
  const [form, setForm] = useState({ email: "", code: "", new_password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmPasswordSetup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await confirmPasswordSetup(form);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell>
        <KeyRound size={30} />
        <h1 id="auth-title">Set your password</h1>
        <p>Enter the 6-digit approval code sent to your email.</p>
        <form className="stacked-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" value={form.email} required onChange={handleChange} />
          </label>
          <label className="field">
            <span>6-digit code</span>
            <input
              name="code"
              inputMode="numeric"
              minLength={6}
              maxLength={6}
              value={form.code}
              required
              onChange={handleChange}
            />
          </label>
          <label className="field">
            <span>New password</span>
            <input
              name="new_password"
              type="password"
              minLength={8}
              value={form.new_password}
              required
              onChange={handleChange}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="button button--primary button--wide" disabled={isSubmitting}>
            {isSubmitting ? "Activating..." : "Activate account"}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">Back to login</Link>
        </div>
    </AuthShell>
  );
}
