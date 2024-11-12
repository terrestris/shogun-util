import fetchSpy, {
  failureResponse,
  successResponse
} from '../../spec/fetchSpy';
import User from '../../model/User';
import GenericEntityService from '../GenericEntityService';
import UserService from '.';

describe('UserService', () => {
  let fetchMock: jest.SpyInstance;
  let service: UserService<User>;

  beforeEach(() => {
    service = new UserService();
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is defined', () => {
    expect(UserService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericEntityService).toBeTruthy();
  });

  it('has set the correct default path', () => {
    expect(service.getBasePath()).toEqual('/users');
  });

  it('sends all required parameters to create all users from the provider (createAllFromProvider)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.createAllFromProvider();

    expect(fetchMock).toHaveBeenCalledWith('/users/createAllFromProvider', {
      headers: {},
      method: 'POST'
    });
  });

  it('throws an error if the users from the provider couldn\'t be created (createAllFromProvider)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.createAllFromProvider()).rejects.toThrow();
  });

});
