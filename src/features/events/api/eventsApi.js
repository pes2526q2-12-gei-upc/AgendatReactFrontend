import { apiRequest } from "@/shared/api/client.js";

export const eventsApi = {
  events() {
    return apiRequest("/api/backoffice/events/");
  },
  event(code) {
    return apiRequest(`/api/backoffice/events/${code}/`);
  },
  createEvent(payload) {
    return apiRequest("/api/backoffice/events/", {
      method: "POST",
      body: payload,
    });
  },
  updateEvent(code, payload) {
    return apiRequest(`/api/backoffice/events/${code}/`, {
      method: "PATCH",
      body: payload,
    });
  },
  updatePublicationStatus(code, publicationStatus) {
    return apiRequest(`/api/backoffice/events/${code}/`, {
      method: "PATCH",
      body: { publication_status: publicationStatus },
    });
  },
  deleteEvent(code) {
    return apiRequest(`/api/backoffice/events/${code}/`, {
      method: "DELETE",
    });
  },
  metrics(code, filters = {}) {
    const params = new URLSearchParams();
    if (filters.from) {
      params.set("from", filters.from);
    }
    if (filters.to) {
      params.set("to", filters.to);
    }

    const suffix = params.toString() ? `?${params.toString()}` : "";
    return apiRequest(`/api/backoffice/events/${code}/metrics/${suffix}`);
  },
  categories() {
    return apiRequest("/api/categories/");
  },
  provincias() {
    return apiRequest("/api/provincies/");
  },
  comarcas(provinciaId) {
    return apiRequest(`/api/provincies/${provinciaId}/comarques/`);
  },
  municipis(provinciaId, comarcaId) {
    return apiRequest(`/api/provincies/${provinciaId}/comarques/${comarcaId}/municipis/`);
  },
};
