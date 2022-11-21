import Keycloak from 'keycloak-js';

export interface BearerTokenHeader {
  'Authorization': string;
}

export const getBearerTokenHeader = (keycloak?: Keycloak): BearerTokenHeader | undefined => {
  let accessToken = keycloak?.token;

  if (!accessToken) {
    return;
  }

  return {
    Authorization: `Bearer ${accessToken}`
  };
};
