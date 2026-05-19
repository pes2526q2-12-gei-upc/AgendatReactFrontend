import { ArrowRight, KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "@/features/auth/components/AuthShell.jsx";
import { useAuth } from "@/features/auth/context/useAuth.js";
import { TextField } from "@/shared/ui/FormControls/FormControls.jsx";

const initialForm = {
  email: "",
  code: "",
  new_password: "",
  confirm_new_password: "",
};

function isInvalidEmail(value) {
  return value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateEmailStep(form) {
  const errors = {};

  if (!form.email.trim()) {
    errors.email = "Enter your email.";
  } else if (isInvalidEmail(form.email)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

function validateCodeStep(form) {
  const errors = validateEmailStep(form);

  if (!form.code.trim()) {
    errors.code = "Enter the 6-digit reset code.";
  } else if (!/^\d{6}$/.test(form.code)) {
    errors.code = "Enter exactly 6 digits.";
  }

  return errors;
}

function validatePasswordStep(form) {
  const errors = validateCodeStep(form);

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

function createPasswordResetPayload(form) {
  return {
    email: form.email,
    code: form.code,
    new_password: form.new_password,
  };
}

export function ForgotPasswordPage() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState("email");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    confirmPasswordReset,
    requestPasswordReset,
    verifyPasswordResetCode,
  } = useAuth();

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

  const submitEmail = async () => {
    const nextFieldErrors = validateEmailStep(form);

    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    await requestPasswordReset({ email: form.email });
    setSuccess("We sent a reset code to your email.");
    setStep("code");
  };

  const submitCode = async () => {
    const nextFieldErrors = validateCodeStep(form);

    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    await verifyPasswordResetCode({ email: form.email, code: form.code });
    setSuccess("Code verified. Choose a new password.");
    setStep("password");
  };

  const submitPassword = async () => {
    const nextFieldErrors = validatePasswordStep(form);

    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    await confirmPasswordReset(createPasswordResetPayload(form));
    setSuccess("Password updated. You can now sign in.");
    setForm(initialForm);
    setStep("done");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      if (step === "email") {
        await submitEmail();
      } else if (step === "code") {
        await submitCode();
      } else if (step === "password") {
        await submitPassword();
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = {
    email: "Send code",
    code: "Verify code",
    password: "Update password",
  }[step];

  return (
    <AuthShell>
      <KeyRound size={30} />
      <h1 id="auth-title">Reset your password</h1>
      <p>We will send a code to your email before you choose a new password.</p>
      {step === "done" ? (
        <>
          {success ? <p className="form-success">{success}</p> : null}
          <div className="auth-links">
            <Link to="/login">Back to login</Link>
            <Link to="/password-setup">Set password</Link>
          </div>
        </>
      ) : (
        <form className="stacked-form" noValidate onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            required
            error={fieldErrors.email}
            onChange={handleChange}
          />
          {step !== "email" ? (
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
          ) : null}
          {step === "password" ? (
            <>
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
            </>
          ) : null}
          {error ? <p className="form-error">{error}</p> : null}
          {success ? <p className="form-success">{success}</p> : null}
          <button
            className="button button--primary button--wide"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : submitLabel}
            {step === "email" ? <MailCheck size={18} /> : null}
            {step === "code" ? <ShieldCheck size={18} /> : null}
            {step === "password" ? <ArrowRight size={18} /> : null}
          </button>
        </form>
      )}
      {step !== "done" ? (
        <div className="auth-links">
          <Link to="/login">Back to login</Link>
          <Link to="/password-setup">Set password</Link>
        </div>
      ) : null}
    </AuthShell>
  );
}
