import Keycloak from 'keycloak-js';

import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';

export interface GraphQLQueryObject {
  query: string;
  variables?: {
    [key: string]: any;
  };
};

export interface GraphQLResponse<T> {
  data: T[];
  errors?: any;
};

export interface GraphQLServiceOpts {
  basePath: string;
  keycloak?: Keycloak;
};

export class GraphQLService {

  private basePath: string;

  private keycloak?: Keycloak;

  constructor(opts: GraphQLServiceOpts = {
    basePath: '/graphql'
  }) {
    this.basePath = opts.basePath;
    this.keycloak = opts.keycloak;
  }

  async sendQuery<T>(query: GraphQLQueryObject, fetchOpts?: RequestInit): Promise<GraphQLResponse<T>> {
    try {
      const response = await fetch(this.basePath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        body: JSON.stringify(query),
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const responseJson = await response.json() as GraphQLResponse<T>;

      if (responseJson.errors?.length > 0) {
        throw new Error(`Error response: ${responseJson.errors}`);
      }

      return responseJson;
    } catch (error) {
      throw new Error(`Error while requesting GraphQL: ${error}`);
    }
  }
}

export default GraphQLService;
