import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';
import { GenericService, GenericServiceOpts } from '../GenericService';

export interface GraphQLQueryObject {
  query: string;
  variables?: Record<string, any>;
}

export interface GraphQLResponse<T> {
  data: Record<string, T>;
  errors?: any;
}

export type GraphQLServiceOpts = GenericServiceOpts;

export class GraphQLService extends GenericService {

  constructor(opts: GraphQLServiceOpts = {
    basePath: '/graphql'
  }) {
    super(opts);
  }

  async sendQuery<T>(query: GraphQLQueryObject, fetchOpts?: RequestInit): Promise<Record<string, T>> {
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

      if (!response?.ok) {
        throw new Error(`HTTP error status: ${response?.status}`);
      }

      const {data, errors } = await response.json() as GraphQLResponse<T>;

      if (errors?.length > 0) {
        throw new Error(`GraphQL error: ${JSON.stringify(errors, null, "\t")}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Error while requesting GraphQL: ${error}`);
    }
  }
}

export default GraphQLService;
