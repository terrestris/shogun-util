import fetchSpy, {
  failureResponse,
  successResponse
} from '../../spec/fetchSpy';

import AppInfoService from '.';

describe('AppInfoService', () => {
  let fetchMock: jest.SpyInstance;
  let service: AppInfoService;

  beforeEach(() => {
    service = new AppInfoService();
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is is defined', () => {
    expect(AppInfoService).toBeDefined();
  });

  it('has set the correct defaults (getAppInfo)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.getAppInfo();

    expect(fetchMock).toHaveBeenCalledWith('/info/app', {
      headers: {},
      method: 'GET'
    });
  });

  it('returns the application info (getAppInfo)', async () => {
    const response = {
      id: 1
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.getAppInfo();

    expect(resp).toEqual(response);
  });

  it('throws an error if the application info couldn\'t be fetched (getAppInfo)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.getAppInfo()).rejects.toThrow();
  });
});
