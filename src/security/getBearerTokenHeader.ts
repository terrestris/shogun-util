import Keycloak from 'keycloak-js';

export const getBearerTokenHeader = (keycloak?: Keycloak): Record<string, string> => {
  let accessToken = keycloak?.token;

  if (!accessToken) {
    return {};
  }

  return {
    Authorization: `Bearer ${accessToken}`
  };
};
