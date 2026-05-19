export function MetricCard({ label, value, hint, icon: Icon }) {
  return (
    <article className="metric-card">
      <div>
        <p>{label}</p>
        <strong>{value ?? 0}</strong>
        {hint ? <span>{hint}</span> : null}
      </div>
      {Icon ? (
        <div className="metric-card__icon" aria-hidden="true">
          <Icon size={20} />
        </div>
      ) : null}
    </article>
  );
}
