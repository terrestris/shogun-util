import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';

// TODO: Make this generic and more specific
export interface GraphQLQueryObject {
  query: string;
  variables?: {
    [key: string]: any;
  };
  operation?: null;
};

export interface GraphQLResponse<T> {
  data: T;
  errors?: any;
};

export interface GraphQLServiceOpts {
  url: string;
};

export class GraphQLService {

  private url: string;

  constructor(opts: GraphQLServiceOpts = {
    url: '/graphql'
  }) {
    this.url = opts.url;
  }

  async sendQuery<T>(query: GraphQLQueryObject, fetchOpts?: RequestInit): Promise<GraphQLResponse<T>> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfTokenHeader()
        },
        body: JSON.stringify(query),
        ...fetchOpts
      });

      const responseJson = await response.json() as GraphQLResponse<T>;

      return responseJson;
    } catch (error) {
      throw new Error(`Error while requesting GraphQL: ${error}`);
    }
  }
}

export default GraphQLService;
