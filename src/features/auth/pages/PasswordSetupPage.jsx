import { KeyRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "@/features/auth/components/AuthShell.jsx";
import { useAuth } from "@/features/auth/context/useAuth.js";
import { TextField } from "@/shared/ui/FormControls/FormControls.jsx";

function isInvalidEmail(value) {
  return value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateForm(form) {
  const errors = {};

  if (!form.email.trim()) {
    errors.email = "Enter your email.";
  } else if (isInvalidEmail(form.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.code.trim()) {
    errors.code = "Enter the 6-digit approval code.";
  } else if (!/^\d{6}$/.test(form.code)) {
    errors.code = "Enter exactly 6 digits.";
  }

  if (!form.new_password) {
    errors.new_password = "Enter a new password.";
  } else if (form.new_password.length < 8) {
    errors.new_password = "Use at least 8 characters.";
  }

  if (!form.confirm_new_password) {
    errors.confirm_new_password = "Confirm the new password.";
  } else if (form.new_password !== form.confirm_new_password) {
    errors.confirm_new_password = "Passwords do not match.";
  }

  return errors;
}

function createPasswordSetupPayload(form) {
  return {
    email: form.email,
    code: form.code,
    new_password: form.new_password,
  };
}

export function PasswordSetupPage() {
  const [form, setForm] = useState({
    email: "",
    code: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmPasswordSetup } = useAuth();
  const navigate = useNavigate();

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
      await confirmPasswordSetup(createPasswordSetupPayload(form));
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
      <form className="stacked-form" noValidate onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          required
          error={fieldErrors.email}
          onChange={handleChange}
        />
        <TextField
          label="6-digit code"
          name="code"
          inputMode="numeric"
          minLength={6}
          maxLength={6}
          value={form.code}
          required
          error={fieldErrors.code}
          onChange={handleChange}
        />
        <TextField
          label="New password"
          name="new_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={form.new_password}
          required
          error={fieldErrors.new_password}
          onChange={handleChange}
        />
        <TextField
          label="Confirm new password"
          name="confirm_new_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={form.confirm_new_password}
          required
          error={fieldErrors.confirm_new_password}
          onChange={handleChange}
        />
        {error ? <p className="form-error">{error}</p> : null}
        <button
          className="button button--primary button--wide"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Activating..." : "Activate account"}
        </button>
      </form>
      <div className="auth-links">
        <Link to="/login">Back to login</Link>
      </div>
    </AuthShell>
  );
}
