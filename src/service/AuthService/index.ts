import Keycloak from 'keycloak-js';

import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';

export interface AuthServiceOpts {
  basePath: string;
  keycloak?: Keycloak;
}

export class AuthService {

  private basePath: string;

  private keycloak?: Keycloak;

  constructor(opts: AuthServiceOpts = {
    basePath: '/sso'
  }) {
    this.basePath = opts.basePath;
    this.keycloak = opts.keycloak;
  }

  async logout(requestOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/logout`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        ...requestOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      if (response.url) {
        window.location.href = response.url;
      } else {
        window.location.reload();
      }
    } catch (error) {
      throw new Error(`Error while logging out: ${error}`);
    }
  }

}

export default AuthService;
