export function eventCode(event) {
  return event?.code ?? event?.id ?? "";
}

export function eventTitle(event) {
  return event?.denomination ?? event?.title ?? "Untitled event";
}

export function eventLocation(event) {
  return (
    [event?.locality, event?.address].filter(Boolean).join(", ") ||
    "No location"
  );
}

export function formatDateRange(event) {
  const start = formatDate(event?.start_date);
  const end = formatDate(event?.end_date);

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || end || "Dates not set";
}

export function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function toDateTimeInput(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

export function fromDateTimeInput(value) {
  return value ? new Date(value).toISOString() : "";
}

export function normalizeNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

export function normalizeCategoryIds(value) {
  if (value === "" || value === null || value === undefined || value === "0") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(Number).filter(Number.isFinite);
  }

  return String(value ?? "")
    .split(",")
    .map((item) => Number(item.trim()))
    .filter(Number.isFinite);
}
