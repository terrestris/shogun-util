import fetchSpy, {
  failureResponse,
  successResponse
} from '../../spec/fetchSpy';
import AuthService from '.';
import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';

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

    const csrfHeaderValue = CsrfUtil.getCsrfValue();
    expect(fetchMock).toHaveBeenCalledWith('/sso/logout', {
      credentials: 'same-origin',
      headers: {
        'X-XSRF-TOKEN': csrfHeaderValue
      },
      method: 'POST'
    });
  });

  it('throws an error if the application info couldn\'t be fetched (logout)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.logout()).rejects.toThrow();
  });
});
