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

    return payload;
  }

  if (payload.detail) {
    return payload.detail;
  }

  if (payload.error) {
    return payload.error;
  }

  const firstEntry = Object.entries(payload)[0];
  if (firstEntry) {
    const [field, value] = firstEntry;
    const valueText = Array.isArray(value) ? value.join(" ") : String(value);
    return `${field}: ${valueText}`;
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
