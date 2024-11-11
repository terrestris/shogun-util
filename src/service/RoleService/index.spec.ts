import fetchSpy, {
  failureResponse,
  successResponse
} from '../../spec/fetchSpy';
import Role from '../../model/Role';
import GenericEntityService from '../GenericEntityService';
import RoleService from '.';

describe('RoleService', () => {
  let fetchMock: jest.SpyInstance;
  let service: RoleService<Role>;

  beforeEach(() => {
    service = new RoleService();
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is defined', () => {
    expect(RoleService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericEntityService).toBeTruthy();
  });

  it('has set the correct default path', () => {
    expect(service.getBasePath()).toEqual('/roles');
  });


  it('sends all required parameters to create all roles from the provider (createAllFromProvider)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.createAllFromProvider();

    expect(fetchMock).toHaveBeenCalledWith('/roles/createAllFromProvider', {
      headers: {},
      method: 'POST'
    });
  });

  it('throws an error if the roles from the provider couldn\'t be created (createAllFromProvider)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.createAllFromProvider()).rejects.toThrow();
  });

});
