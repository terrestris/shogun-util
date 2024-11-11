import fetchSpy, {
  failureResponse,
  successResponse
} from '../../spec/fetchSpy';
import Group, { KeycloakGroupRepresentation } from '../../model/Group';
import GenericEntityService from '../GenericEntityService';
import GroupService from '.';

describe('GroupService', () => {
  let fetchMock: jest.SpyInstance;
  let service: GroupService<Group<KeycloakGroupRepresentation>, KeycloakGroupRepresentation>;

  beforeEach(() => {
    service = new GroupService<Group<KeycloakGroupRepresentation>, KeycloakGroupRepresentation>();
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is defined', () => {
    expect(GroupService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericEntityService).toBeTruthy();
  });

  it('has set the correct default path', () => {
    expect(service.getBasePath()).toEqual('/groups');
  });

  it('sends all required parameters to create all groups from the provider (createAllFromProvider)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.createAllFromProvider();

    expect(fetchMock).toHaveBeenCalledWith('/groups/createAllFromProvider', {
      headers: {},
      method: 'POST'
    });
  });

  it('throws an error if the groups from the provider couldn\'t be created (createAllFromProvider)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.createAllFromProvider()).rejects.toThrow();
  });

});
