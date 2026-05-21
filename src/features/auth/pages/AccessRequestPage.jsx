import { Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "@/features/auth/components/AuthShell.jsx";
import { useAuth } from "@/features/auth/context/useAuth.js";
import { saveOrganizationLogin } from "@/features/auth/utils/organizationLogin.js";
import {
  TextAreaField,
  TextField,
} from "@/shared/ui/FormControls/FormControls.jsx";

const initialForm = {
  organization_name: "",
  contact_name: "",
  contact_email: "",
  phone: "",
  website: "",
  notes: "",
};

function isInvalidEmail(value) {
  return value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isInvalidUrl(value) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return !["http:", "https:"].includes(url.protocol);
  } catch {
    return true;
  }
}

function validateForm(form) {
  const errors = {};

  if (!form.organization_name.trim()) {
    errors.organization_name = "Enter the organization name.";
  }

  if (!form.contact_name.trim()) {
    errors.contact_name = "Enter the contact name.";
  }

  if (!form.contact_email.trim()) {
    errors.contact_email = "Enter the contact email.";
  } else if (isInvalidEmail(form.contact_email)) {
    errors.contact_email = "Enter a valid contact email.";
  }

  if (isInvalidUrl(form.website)) {
    errors.website =
      "Enter a valid website URL starting with http:// or https://.";
  }

  return errors;
}

function createAccessRequestPayload(form) {
  return {
    username: form.organization_name,
    first_name: form.contact_name.trim(),
    last_name: "",
    email: form.contact_email.trim(),
    phone: form.phone.trim(),
    website: form.website.trim(),
    notes: form.notes.trim(),
  };
}

export function AccessRequestPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestAccess } = useAuth();

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
    setStatus(null);
    const nextFieldErrors = validateForm(form);

    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const payload = createAccessRequestPayload(form);
      const response = await requestAccess(payload);
      saveOrganizationLogin(payload.username);
      setStatus(response?.status ?? "pending");
      setForm(initialForm);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell wide>
      <span className="eyebrow">Client access</span>
      <h1 id="auth-title">Request a backoffice account</h1>
      <p>
        Your request will be reviewed by the Agenda&apos;t team before password
        setup.
      </p>
      <form className="form-grid" noValidate onSubmit={handleSubmit}>
        <TextField
          label="Organization name"
          name="organization_name"
          value={form.organization_name}
          required
          error={fieldErrors.organization_name}
          onChange={handleChange}
        />
        <TextField
          label="Contact name"
          name="contact_name"
          value={form.contact_name}
          required
          error={fieldErrors.contact_name}
          onChange={handleChange}
        />
        <TextField
          label="Contact email"
          name="contact_email"
          type="email"
          value={form.contact_email}
          required
          error={fieldErrors.contact_email}
          onChange={handleChange}
        />
        <TextField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <TextField
          label="Website"
          name="website"
          type="url"
          value={form.website}
          placeholder="https://example.com"
          error={fieldErrors.website}
          onChange={handleChange}
        />
        <TextAreaField
          label="Notes"
          name="notes"
          value={form.notes}
          placeholder="Tell us about your organization and events."
          onChange={handleChange}
        />
        {error ? <p className="form-error field--full">{error}</p> : null}
        {status ? (
          <p className="form-success field--full">
            Request submitted with status: <strong>{status}</strong>.
          </p>
        ) : null}
        <div className="form-actions field--full">
          <Link className="button button--secondary" to="/login">
            Back to login
          </Link>
          <button className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit request"}
            <Send size={17} />
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
