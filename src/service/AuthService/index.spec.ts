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

  it('is defined', () => {
    expect(AuthService).toBeDefined();
  });

  it('sends all required parameters to logout (logout)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.logout();

    expect(fetchMock).toHaveBeenCalledWith('/sso/logout', {
      credentials: 'same-origin',
      headers: {},
      method: 'POST'
    });
  });

  it('throws an error if the application info couldn\'t be fetched (logout)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.logout()).rejects.toThrow();
  });
});
