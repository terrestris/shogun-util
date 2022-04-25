import fetchSpy, {
  failureResponse,
  successResponse
} from '../../spec/fetchSpy';

import AuthService from '.';

describe('AuthService', () => {
  let fetchMock: jest.SpyInstance;
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is is defined', () => {
    expect(AuthService).toBeDefined();
  });

  it('logout POST', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.logout();

    expect(fetchMock).toHaveBeenCalledWith('/sso/logout', {
      credentials: 'same-origin',
      headers: {},
      method: 'POST'
    });
  });

  it('throws an error if the application info couldn\'t be fetched (getAppInfo)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.logout()).rejects.toThrow();
  });
});
