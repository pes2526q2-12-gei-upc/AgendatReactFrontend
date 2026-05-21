export function normalizeOrganizationIdentity(value) {
  return value.trim();
}

export function buildOrganizationIdentityFields(value) {
  const organizationIdentity = normalizeOrganizationIdentity(value);

  return {
    username: organizationIdentity,
    organization_name: organizationIdentity,
    organizationName: organizationIdentity,
    organization: organizationIdentity,
  };
}
