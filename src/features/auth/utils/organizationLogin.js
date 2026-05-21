const organizationLoginKey = "agendat_organization_login";

export function getSavedOrganizationLogin() {
  try {
    return localStorage.getItem(organizationLoginKey) ?? "";
  } catch {
    return "";
  }
}

export function saveOrganizationLogin(value) {
  try {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      localStorage.removeItem(organizationLoginKey);
      return;
    }

    localStorage.setItem(organizationLoginKey, normalizedValue);
  } catch {
    // Ignore storage issues so auth flows still work in restricted contexts.
  }
}
