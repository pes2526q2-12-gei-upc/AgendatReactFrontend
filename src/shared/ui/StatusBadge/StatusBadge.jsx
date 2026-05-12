const statusLabels = {
  pending_review: "Pending review",
  published: "Published",
  rejected: "Rejected",
  archived: "Archived",
  draft: "Draft",
};

export function StatusBadge({ status = "draft" }) {
  const normalizedStatus = status || "draft";

  return (
    <span className={`status-badge status-badge--${normalizedStatus}`}>
      {statusLabels[normalizedStatus] ?? normalizedStatus.replaceAll("_", " ")}
    </span>
  );
}
