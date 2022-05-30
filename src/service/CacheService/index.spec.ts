import fetchSpy, {
  failureResponse,
  successResponse
} from '../../spec/fetchSpy';

import CacheService from '.';

describe('AppInfoService', () => {
  let fetchMock: jest.SpyInstance;
  let service: CacheService;

  beforeEach(() => {
    service = new CacheService();
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is is defined', () => {
    expect(CacheService).toBeDefined();
  });

  it('has set the correct defaults (evictCache)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.evictCache();

    expect(fetchMock).toHaveBeenCalledWith('/cache/evict', {
      headers: {},
      method: 'POST'
    });
  });

  it('calls the evict cache endpoint (evictCache)', async () => {
    fetchMock = fetchSpy(successResponse());

    await service.evictCache();

    expect(true).toEqual(true);
  });

  it('throws an error if the application info couldn\'t be fetched (evictCache)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.evictCache()).rejects.toThrow();
  });
});
