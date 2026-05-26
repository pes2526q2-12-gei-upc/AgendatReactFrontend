const tokenKey = "agendat_backoffice_token";

const configuredBaseUrl = globalThis.__AGENDAT_API_BASE_URL__ || "";
const apiBaseUrl = configuredBaseUrl.replace(/\/$/, "");

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const tokenStore = {
  get() {
    return localStorage.getItem(tokenKey);
  },
  set(token) {
    localStorage.setItem(tokenKey, token);
  },
  clear() {
    localStorage.removeItem(tokenKey);
  },
};

function normalizePath(path) {
  return path.startsWith("/") ? path : `/${path}`;
}

function buildUrl(path) {
  return `${apiBaseUrl}${normalizePath(path)}`;
}

function toSentenceCase(value) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function humanizeFieldName(field) {
  const fieldLabels = {
    non_field_errors: "Request",
    username: "Organization name",
    organization_name: "Organization name",
    contact_name: "Contact name",
    contact_email: "Contact email",
    new_password: "New password",
    confirm_new_password: "Confirm new password",
    url_activity: "Activity URL",
    url_ticket: "Ticket URL",
    start_date: "Start date",
    end_date: "End date",
    category_ids: "Categories",
    provincia_id: "Province",
    comarca_id: "County",
    municipi_id: "Municipality",
    telephone_locality: "Contact phone",
  };

  return (
    fieldLabels[field] ?? toSentenceCase(String(field).replaceAll("_", " "))
  );
}

function translateKnownErrorMessage(message) {
  if (!message) {
    return "";
  }

  const normalized = String(message).trim();
  const exactMatches = new Map([
    ["Aquest camp és obligatori.", "This field is required."],
    ["Este campo es obligatorio.", "This field is required."],
    ["This field is required.", "This field is required."],
    ["Aquest camp no pot estar buit.", "This field cannot be blank."],
    ["Este campo no puede estar en blanco.", "This field cannot be blank."],
    ["This field may not be blank.", "This field cannot be blank."],
    [
      "Introduïu una adreça de correu electrònic vàlida.",
      "Enter a valid email address.",
    ],
    [
      "Introduzca una dirección de correo electrónico válida.",
      "Enter a valid email address.",
    ],
    [
      "No s'han proporcionat credencials d'autenticació.",
      "Authentication credentials were not provided.",
    ],
    [
      "No se proporcionaron credenciales de autenticación.",
      "Authentication credentials were not provided.",
    ],
    [
      "No teniu permís per realitzar aquesta acció.",
      "You do not have permission to perform this action.",
    ],
    [
      "No tiene permiso para realizar esta acción.",
      "You do not have permission to perform this action.",
    ],
    ["No trobat.", "Not found."],
    ["No encontrado.", "Not found."],
    ["No s'ha trobat.", "Not found."],
    ["No se ha encontrado.", "Not found."],
    ["Codi invàlid.", "Invalid code."],
    ["Código inválido.", "Invalid code."],
    ["El codi ha caducat.", "The code has expired."],
    ["El código ha caducado.", "The code has expired."],
    ["Contrasenya incorrecta.", "Incorrect password."],
    ["Contraseña incorrecta.", "Incorrect password."],
    ["Credencials invàlides.", "Invalid credentials."],
    ["Credenciales inválidas.", "Invalid credentials."],
    ["Token invàlid.", "Invalid token."],
    ["Token inválido.", "Invalid token."],
  ]);

  if (exactMatches.has(normalized)) {
    return exactMatches.get(normalized);
  }

  const regexMatches = [
    [
      /^Asegúrese de que este campo tenga al menos (\d+) caracteres\.?$/i,
      "Use at least $1 characters.",
    ],
    [
      /^Assegureu-vos que aquest camp tingui almenys (\d+) caràcters\.?$/i,
      "Use at least $1 characters.",
    ],
    [
      /^Asegúrese de que este campo no tenga más de (\d+) caracteres\.?$/i,
      "Use no more than $1 characters.",
    ],
    [
      /^Assegureu-vos que aquest camp no tingui més de (\d+) caràcters\.?$/i,
      "Use no more than $1 characters.",
    ],
    [
      /^No active account found with the given credentials$/i,
      "No active account was found with those credentials.",
    ],
  ];

  for (const [pattern, replacement] of regexMatches) {
    if (pattern.test(normalized)) {
      return normalized.replace(pattern, replacement);
    }
  }

  return normalized;
}

function localizeErrorValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => translateKnownErrorMessage(item)).join(" ");
  }

  return translateKnownErrorMessage(String(value));
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function errorMessage(payload, fallback) {
  if (!payload) {
    return fallback;
  }

  if (typeof payload === "string") {
    if (
      payload.trim().startsWith("<!DOCTYPE html>") ||
      payload.trim().startsWith("<html")
    ) {
      return fallback;
    }

    return translateKnownErrorMessage(payload);
  }

  if (payload.detail) {
    return localizeErrorValue(payload.detail);
  }

  if (payload.error) {
    return localizeErrorValue(payload.error);
  }

  const firstEntry = Object.entries(payload)[0];
  if (firstEntry) {
    const [field, value] = firstEntry;
    return `${humanizeFieldName(field)}: ${localizeErrorValue(value)}`;
  }

  return fallback;
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    auth = true,
    headers: customHeaders = {},
  } = options;
  const headers = { ...customHeaders };

  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = tokenStore.get();
  if (auth && token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers,
    body:
      body === undefined || body instanceof FormData
        ? body
        : JSON.stringify(body),
  });
  const payload = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401) {
      tokenStore.clear();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    throw new ApiError(
      response.status,
      errorMessage(payload, "The request could not be completed."),
      payload,
    );
  }

  return payload;
}

export function listFromResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}
