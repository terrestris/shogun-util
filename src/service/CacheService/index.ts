import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';
import { GenericService, GenericServiceOpts } from '../GenericService';

export type CacheServiceOpts = GenericServiceOpts;

export class CacheService extends GenericService {

  constructor(opts: CacheServiceOpts = {
    basePath: '/cache'
  }) {
    super(opts);
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
