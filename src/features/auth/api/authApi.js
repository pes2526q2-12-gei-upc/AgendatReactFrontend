import { apiRequest } from "@/shared/api/client.js";

export const authApi = {
  requestAccess(payload) {
    return apiRequest("/api/backoffice/access-requests/", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
  confirmPasswordSetup(payload) {
    return apiRequest("/api/backoffice/password-setup/confirm/", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
  requestPasswordReset(payload) {
    return apiRequest("/api/backoffice/password-reset/request/", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
  verifyPasswordResetCode(payload) {
    return apiRequest("/api/backoffice/password-reset/verify/", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
  confirmPasswordReset(payload) {
    return apiRequest("/api/backoffice/password-reset/confirm/", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
  login(payload) {
    return apiRequest("/api/users/login/", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
  me() {
    return apiRequest("/api/backoffice/me/");
  },
};
