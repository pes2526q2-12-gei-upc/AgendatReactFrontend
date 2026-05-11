import { Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "@/features/auth/components/AuthShell.jsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { TextAreaField, TextField } from "@/shared/ui/FormControls/FormControls.jsx";

const initialForm = {
  organization_name: "",
  contact_name: "",
  contact_email: "",
  phone: "",
  website: "",
  notes: "",
};

export function AccessRequestPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestAccess } = useAuth();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus(null);
    setIsSubmitting(true);

    try {
      const response = await requestAccess(form);
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
        <p>Your request will be reviewed by the Agenda&apos;t team before password setup.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <TextField
            label="Organization name"
            name="organization_name"
            value={form.organization_name}
            required
            onChange={handleChange}
          />
          <TextField
            label="Contact name"
            name="contact_name"
            value={form.contact_name}
            required
            onChange={handleChange}
          />
          <TextField
            label="Contact email"
            name="contact_email"
            type="email"
            value={form.contact_email}
            required
            onChange={handleChange}
          />
          <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <TextField
            label="Website"
            name="website"
            type="url"
            value={form.website}
            placeholder="https://example.com"
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
