import logoAgendat from "@/assets/logoAgendat.png";
import { Link } from "react-router-dom";

export function AuthShell({ children, hero = false, wide = false }) {
  if (!hero) {
    return (
      <main className="auth-page auth-page--single">
        <section
          className={`auth-panel${wide ? " auth-panel--wide" : ""}`}
          aria-labelledby="auth-title"
        >
          {children}
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand-lockup brand-lockup--auth">
          <span className="brand-mark" aria-hidden="true">
            <img src={logoAgendat} alt="" />
          </span>
          <div>
            <strong>Agenda&apos;t</strong>
            <span>Backoffice</span>
          </div>
        </div>
        <h1>Client performance workspace</h1>
        <ol className="auth-steps" aria-label="Account setup steps">
          <li>
            <span>1</span>
            <div>
              <strong>Request access</strong>
              <p>
                Go to <Link to="/access-request">Request access</Link> and send
                your organization details.
              </p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <strong>Set your password</strong>
              <p>
                Use the email code in{" "}
                <Link to="/password-setup">Set password</Link> to activate the
                account.
              </p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <strong>Sign in</strong>
              <p>
                Return here with your email and password to enter the
                backoffice.
              </p>
            </div>
          </li>
        </ol>
      </section>
      <section className="auth-panel" aria-labelledby="auth-title">
        {children}
      </section>
    </main>
  );
}
