import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="auth-page auth-page--single">
      <section className="auth-panel">
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist in this backoffice.</p>
        <Link className="button button--primary" to="/dashboard">
          Go to dashboard
        </Link>
      </section>
    </main>
  );
}
