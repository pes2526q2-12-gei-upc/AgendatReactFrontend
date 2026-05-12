import logoAgendat from "@/assets/logoAgendat.png";

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
        <p>Create events, follow publication status, and understand audience signals.</p>
      </section>
      <section className="auth-panel" aria-labelledby="auth-title">
        {children}
      </section>
    </main>
  );
}
