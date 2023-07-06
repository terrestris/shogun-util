import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';
import { GenericService, GenericServiceOpts } from '../GenericService';

export type AuthServiceOpts = GenericServiceOpts;

export class AuthService extends GenericService {

  constructor(opts: AuthServiceOpts = {
    basePath: '/sso'
  }) {
    super(opts);
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
