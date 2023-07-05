import Keycloak from 'keycloak-js';

import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';

export interface CacheServiceOpts {
  basePath: string;
  keycloak?: Keycloak;
}

export class CacheService {

  private basePath: string;

  private keycloak?: Keycloak;

  constructor(opts: CacheServiceOpts = {
    basePath: '/cache'
  }) {
    this.basePath = opts.basePath;
    this.keycloak = opts.keycloak;
  }

  async evictCache(fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/evict`, {
        method: 'POST',
        headers: {
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while clearing the cache: ${error}`);
    }
  }

}

export default CacheService;
