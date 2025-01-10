import fetchSpy, {
  failureResponse,
  successResponse
} from '../../spec/fetchSpy';
import CacheService from '.';
import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';

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

  it('is defined', () => {
    expect(CacheService).toBeDefined();
  });

  it('sends all required parameters to evict the cache (evictCache)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.evictCache();
    const csrfHeaderValue = CsrfUtil.getCsrfValue();
    expect(fetchMock).toHaveBeenCalledWith('/cache/evict', {
      headers: {
        'X-XSRF-TOKEN': csrfHeaderValue
      },
      method: 'POST'
    });
  });

  it('throws an error if the application info couldn\'t be fetched (evictCache)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.evictCache()).rejects.toThrow();
  });
});
