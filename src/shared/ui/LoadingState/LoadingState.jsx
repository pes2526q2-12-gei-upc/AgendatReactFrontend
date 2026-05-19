export function LoadingState({ label = "Loading", fullScreen = false }) {
  return (
    <div className={fullScreen ? "state-screen" : "state-block"} role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
