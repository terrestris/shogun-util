import { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { GenericService, GenericServiceOpts } from '../GenericService';

export type OpenApiVersion = 'v2' | 'v3';

export type OpenAPIServiceOpts = GenericServiceOpts;

export class OpenAPIService extends GenericService {

  constructor(opts: OpenAPIServiceOpts = {
    basePath: '/'
  }) {
    super(opts);
  }

  async getApiDocs(version: OpenApiVersion = 'v2', fetchOpts?: RequestInit):
    Promise<OpenAPIV2.Document | OpenAPIV3.Document> {
    try {
      const response = await fetch(`${this.basePath}${version}/api-docs`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json = await response.json();

      if (version === 'v3') {
        return json as OpenAPIV3.Document;
      }

      return json as OpenAPIV2.Document;
    } catch (error) {
      throw new Error(`Error while requesting the swagger docs: ${error}`);
    }
  }

}

export default OpenAPIService;
