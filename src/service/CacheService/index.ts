import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';

export interface CacheServiceOpts {
  basePath: string;
};

export class CacheService {
  private basePath: string;

  constructor(opts: CacheServiceOpts = {
    basePath: '/cache'
  }) {
    this.basePath = opts.basePath;
  }

  async evictCache(fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/evict`, {
        method: 'POST',
        headers: {
          ...getCsrfTokenHeader()
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
