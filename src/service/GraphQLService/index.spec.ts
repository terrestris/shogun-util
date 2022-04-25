import GraphQLService, { GraphQLQueryObject } from './index';

import fetchSpy, {
  failureResponse,
  successResponse
} from '../../spec/fetchSpy';

import User from '../../model/User';

describe('GraphQLService', () => {
  let fetchMock: jest.SpyInstance;
  let service: GraphQLService;

  beforeEach(() => {
    service = new GraphQLService();
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is defined', () => {
    expect(GraphQLService).toBeDefined();
  });

  it('returns the expected entity', async () => {
    const expected: User[] = [{
      id: 1,
      keycloakId: '123456789'
    }];

    const response = {
      data: expected
    };

    fetchMock = fetchSpy(successResponse(response));

    const query = `query($id: Int) {
      userById(id: $id) {
        id
        keycloakId
      }
    }`;

    const graphqlQuery: GraphQLQueryObject = {
      query: query,
      variables: {
        id: 1
      }
    };

    const result = await service.sendQuery<User>(graphqlQuery);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual(expected);
  });

  it('throws an error if the endpoint returns an errenous status code', async () => {
    fetchMock = fetchSpy(failureResponse());

    const query = `query($id: Int) {
      userById(id: $id) {
        id
        keycloakId
      }
    }`;

    const graphqlQuery: GraphQLQueryObject = {
      query: query,
      variables: {
        id: 1
      }
    };

    await expect(service.sendQuery<User>(graphqlQuery)).rejects.toThrow();
  });

  it('throws an error if the response contains an error', async () => {
    const expected = ['Error'];

    const response = {
      errors: expected
    };

    fetchMock = fetchSpy(successResponse(response));

    const query = `query($id: Int) {
      userById(id: $id) {
        id
        keycloakId
      }
    }`;

    const graphqlQuery: GraphQLQueryObject = {
      query: query,
      variables: {
        id: 1
      }
    };

    await expect(service.sendQuery<User>(graphqlQuery)).rejects.toThrow();
  });
});
