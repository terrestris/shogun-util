import Keycloak from 'keycloak-js';

import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';

export interface SwaggerDocs {
  basePath: string;
  definitions: {
    [key: string]: any;
  };
  host: string;
  info: any;
  paths: {
    [key: string]: any;
  };
  securityDefinitions: {
    [key: string]: any;
  };
  swagger: string;
  tags: {
    name: string;
    description: string;
  }[];
}

export interface OpenAPIServiceOpts {
  basePath: string;
  keycloak?: Keycloak;
};

export class OpenAPIService {

  private basePath: string;

  private keycloak?: Keycloak;

  constructor(opts: OpenAPIServiceOpts = {
    basePath: '/v2'
  }) {
    this.basePath = opts.basePath;
    this.keycloak = opts.keycloak;
  }

  async getApiDocs(fetchOpts?: RequestInit): Promise<SwaggerDocs> {
    try {
      const response = await fetch(`${this.basePath}/api-docs`, {
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

      return json;
    } catch (error) {
      throw new Error(`Error while requesting the swagger docs: ${error}`);
    }
  }

}

export default OpenAPIService;
