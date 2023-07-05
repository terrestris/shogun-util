import fetchSpy, {
  failureResponse,
  successResponse
} from '../../spec/fetchSpy';
import OpenAPIService from '.';

describe('OpenAPIService', () => {
  let fetchMock: jest.SpyInstance;
  let service: OpenAPIService;

  beforeEach(() => {
    service = new OpenAPIService();
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is defined', () => {
    expect(OpenAPIService).toBeDefined();
  });

  it('has set the correct defaults (getApiDocs)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.getApiDocs();

    expect(fetchMock).toHaveBeenCalledWith('/v2/api-docs', {
      headers: {},
      method: 'GET'
    });
  });

  it('returns the api docs (getApiDocs)', async () => {
    const response = {
      id: 1
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.getApiDocs();

    expect(resp).toEqual(response);
  });

  it('throws an error if the api docs couldn\'t be fetched (getApiDocs)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.getApiDocs()).rejects.toThrow();
  });
});
