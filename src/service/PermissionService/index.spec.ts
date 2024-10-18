import Keycloak from 'keycloak-js';

import GroupClassPermission from '../../model/security/GroupClassPermission';
import GroupInstancePermission from '../../model/security/GroupInstancePermission';
import UserClassPermission from '../../model/security/UserClassPermission';
import UserInstancePermission from '../../model/security/UserInstancePermission';
import fetchSpy, {
  failureResponse,
  successResponse
} from '../../spec/fetchSpy';
import PermissionService from '.';

describe('PermissionService', () => {
  let fetchMock: jest.SpyInstance;
  let service: PermissionService;

  beforeEach(() => {
    const keycloak: Keycloak = new Keycloak({
      clientId: 'EXAMPLE',
      realm: 'EXAMPLE',
      url: 'https://example.com/auth'
    });
    keycloak.token = 'ThisIsNotAValidBearerToken';

    service = new PermissionService({
      basePath: '',
      keycloak
    });
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is defined', () => {
    expect(PermissionService).toBeDefined();
  });

  it('sends all required parameters to return all user instance ' +
    'permissions for an entity (getUserInstancePermissions)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.getUserInstancePermissions(1909);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/instance/user', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'GET'
    });
  });

  it('returns all user instance permissions for an entity (getUserInstancePermissions)', async () => {
    const response: UserInstancePermission[] = [{
      id: 1,
      created: new Date(),
      modified: new Date(),
      entityId: 1909,
      permission: {
        id: 10,
        created: new Date(),
        modified: new Date(),
        name: 'ADMIN',
        permissions: [
          'ADMIN'
        ]
      },
      user: {
        id: 20,
        created: new Date(),
        modified: new Date()
      }
    }, {
      id: 2,
      created: new Date(),
      modified: new Date(),
      entityId: 1909,
      permission: {
        id: 11,
        created: new Date(),
        modified: new Date(),
        name: 'CREATE',
        permissions: [
          'CREATE'
        ]
      },
      user: {
        id: 30,
        created: new Date(),
        modified: new Date()
      }
    }];

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.getUserInstancePermissions(1909);

    expect(resp).toEqual(response);
  });

  it('throws an error if the user instance permissions for an entity ' +
    'couldn\'t be fetched (getUserInstancePermissions)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.getUserInstancePermissions(1909)).rejects.toThrow();
  });

  it('sends all required parameters to return all group instance ' +
    'permissions for an entity (getGroupInstancePermissions)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.getGroupInstancePermissions(1909);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/instance/group', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'GET'
    });
  });

  it('returns all group instance permissions for an entity (getGroupInstancePermissions)', async () => {
    const response: GroupInstancePermission[] = [{
      id: 1,
      created: new Date(),
      modified: new Date(),
      entityId: 1909,
      permission: {
        id: 10,
        created: new Date(),
        modified: new Date(),
        name: 'ADMIN',
        permissions: [
          'ADMIN'
        ]
      },
      group: {
        id: 20,
        created: new Date(),
        modified: new Date()
      }
    }, {
      id: 2,
      created: new Date(),
      modified: new Date(),
      entityId: 1909,
      permission: {
        id: 11,
        created: new Date(),
        modified: new Date(),
        name: 'CREATE',
        permissions: [
          'CREATE'
        ]
      },
      group: {
        id: 30,
        created: new Date(),
        modified: new Date()
      }
    }];

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.getGroupInstancePermissions(1909);

    expect(resp).toEqual(response);
  });

  it('throws an error if the group instance permissions for an entity ' +
    'couldn\'t be fetched (getGroupInstancePermissions)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.getGroupInstancePermissions(1909)).rejects.toThrow();
  });

  it('sends all required parameters to return all user class ' +
    'permissions for an entity (getUserClassPermissions)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.getUserClassPermissions(1909);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/class/user', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'GET'
    });
  });

  it('returns all user class permissions for an entity (getUserClassPermissions)', async () => {
    const response: UserClassPermission[] = [{
      id: 1,
      created: new Date(),
      modified: new Date(),
      className: 'Application',
      permission: {
        id: 10,
        created: new Date(),
        modified: new Date(),
        name: 'ADMIN',
        permissions: [
          'ADMIN'
        ]
      },
      user: {
        id: 20,
        created: new Date(),
        modified: new Date()
      }
    }];

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.getUserClassPermissions(1909);

    expect(resp).toEqual(response);
  });

  it('throws an error if the user class permissions for an entity ' +
    'couldn\'t be fetched (getUserClassPermissions)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.getUserClassPermissions(1909)).rejects.toThrow();
  });

  it('sends all required parameters to return all group class ' +
    'permissions for an entity (getGroupClassPermissions)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.getGroupClassPermissions(1909);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/class/group', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'GET'
    });
  });

  it('returns all group class permissions for an entity (getGroupClassPermissions)', async () => {
    const response: GroupClassPermission[] = [{
      id: 1,
      created: new Date(),
      modified: new Date(),
      className: 'Application',
      permission: {
        id: 10,
        created: new Date(),
        modified: new Date(),
        name: 'ADMIN',
        permissions: [
          'ADMIN'
        ]
      },
      group: {
        id: 20,
        created: new Date(),
        modified: new Date()
      }
    }];

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.getGroupClassPermissions(1909);

    expect(resp).toEqual(response);
  });

  it('throws an error if the group class permissions for an entity ' +
    'couldn\'t be fetched (getGroupClassPermissions)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.getGroupClassPermissions(1909)).rejects.toThrow();
  });

  it('sends all required parameters to return the user instance ' +
    'permission for an entity (getUserInstancePermission)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.getUserInstancePermission(1909, 10);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/instance/user/10', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'GET'
    });
  });

  it('returns the user instance permission for an entity (getUserInstancePermission)', async () => {
    const response: UserInstancePermission = {
      id: 1,
      created: new Date(),
      modified: new Date(),
      entityId: 1909,
      permission: {
        id: 10,
        created: new Date(),
        modified: new Date(),
        name: 'ADMIN',
        permissions: [
          'ADMIN'
        ]
      },
      user: {
        id: 20,
        created: new Date(),
        modified: new Date()
      }
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.getUserInstancePermission(1909, 10);

    expect(resp).toEqual(response);
  });

  it('throws an error if the user instance permission for an entity ' +
    'couldn\'t be fetched (getUserInstancePermission)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.getUserInstancePermission(1909, 10)).rejects.toThrow();
  });

  it('sends all required parameters to return the group instance ' +
    'permission for an entity (getGroupInstancePermission)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.getGroupInstancePermission(1909, 10);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/instance/group/10', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'GET'
    });
  });

  it('returns the group instance permission for an entity (getGroupInstancePermission)', async () => {
    const response: GroupInstancePermission = {
      id: 1,
      created: new Date(),
      modified: new Date(),
      entityId: 1909,
      permission: {
        id: 10,
        created: new Date(),
        modified: new Date(),
        name: 'ADMIN',
        permissions: [
          'ADMIN'
        ]
      },
      group: {
        id: 20,
        created: new Date(),
        modified: new Date()
      }
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.getGroupInstancePermission(1909, 10);

    expect(resp).toEqual(response);
  });

  it('throws an error if the group instance permission for an entity ' +
    'couldn\'t be fetched (getGroupInstancePermission)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.getGroupInstancePermission(1909, 10)).rejects.toThrow();
  });

  it('sends all required parameters to return the user class ' +
    'permission for an entity (getUserClassPermission)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.getUserClassPermission(1909, 10);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/class/user/10', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'GET'
    });
  });

  it('returns the user class permission for an entity (getUserClassPermission)', async () => {
    const response: UserClassPermission = {
      id: 1,
      created: new Date(),
      modified: new Date(),
      className: 'Application',
      permission: {
        id: 10,
        created: new Date(),
        modified: new Date(),
        name: 'ADMIN',
        permissions: [
          'ADMIN'
        ]
      },
      user: {
        id: 20,
        created: new Date(),
        modified: new Date()
      }
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.getUserClassPermission(1909, 10);

    expect(resp).toEqual(response);
  });

  it('throws an error if the user class permission for an entity ' +
    'couldn\'t be fetched (getUserClassPermission)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.getUserClassPermission(1909, 10)).rejects.toThrow();
  });

  it('sends all required parameters to return the group class ' +
    'permission for an entity (getGroupClassPermission)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.getGroupClassPermission(1909, 10);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/class/group/10', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'GET'
    });
  });

  it('returns the group class permission for an entity (getGroupClassPermission)', async () => {
    const response: GroupClassPermission = {
      id: 1,
      created: new Date(),
      modified: new Date(),
      className: 'Application',
      permission: {
        id: 10,
        created: new Date(),
        modified: new Date(),
        name: 'ADMIN',
        permissions: [
          'ADMIN'
        ]
      },
      group: {
        id: 20,
        created: new Date(),
        modified: new Date()
      }
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.getGroupClassPermission(1909, 20);

    expect(resp).toEqual(response);
  });

  it('throws an error if the group class permission for an entity ' +
    'couldn\'t be fetched (getGroupClassPermission)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.getGroupClassPermission(1909, 10)).rejects.toThrow();
  });

  it('sends all required parameters to set the user instance ' +
    'permission for an entity (setUserInstancePermission)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.setUserInstancePermission(1909, 10, 'ADMIN');

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/instance/user/10', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken',
        'Content-Type': 'application/json'
      },
      body: '{\"permission\":\"ADMIN\"}',
      method: 'POST'
    });
  });

  it('sets the user instance permission for an entity (setUserInstancePermission)', async () => {
    fetchMock = fetchSpy(successResponse(null));

    await expect(service.setUserInstancePermission(1909, 10, 'ADMIN')).resolves.not.toThrow();
  });

  it('throws an error if the user instance permission for an entity ' +
    'couldn\'t be set (setUserInstancePermission)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.setUserInstancePermission(1909, 10, 'ADMIN')).rejects.toThrow();
  });

  it('sends all required parameters to set the group instance ' +
    'permission for an entity (setGroupInstancePermission)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.setGroupInstancePermission(1909, 10, 'ADMIN');

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/instance/group/10', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken',
        'Content-Type': 'application/json'
      },
      body: '{\"permission\":\"ADMIN\"}',
      method: 'POST'
    });
  });

  it('sets the group instance permission for an entity (setGroupInstancePermission)', async () => {
    fetchMock = fetchSpy(successResponse(null));

    await expect(service.setGroupInstancePermission(1909, 10, 'ADMIN')).resolves.not.toThrow();
  });

  it('throws an error if the group instance permission for an entity ' +
    'couldn\'t be set (setGroupInstancePermission)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.setGroupInstancePermission(1909, 10, 'ADMIN')).rejects.toThrow();
  });

  it('sends all required parameters to set the user class ' +
    'permission for an entity (setUserClassPermission)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.setUserClassPermission(1909, 10, 'ADMIN');

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/class/user/10', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken',
        'Content-Type': 'application/json'
      },
      body: '{\"permission\":\"ADMIN\"}',
      method: 'POST'
    });
  });

  it('sets the user class permission for an entity (setUserClassPermission)', async () => {
    fetchMock = fetchSpy(successResponse(null));

    await expect(service.setUserClassPermission(1909, 10, 'ADMIN')).resolves.not.toThrow();
  });

  it('throws an error if the user class permission for an entity ' +
    'couldn\'t be set (setUserClassPermission)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.setUserClassPermission(1909, 10, 'ADMIN')).rejects.toThrow();
  });

  it('sends all required parameters to set the group class ' +
    'permission for an entity (setGroupClassPermission)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.setGroupClassPermission(1909, 10, 'ADMIN');

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/class/group/10', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken',
        'Content-Type': 'application/json'
      },
      body: '{\"permission\":\"ADMIN\"}',
      method: 'POST'
    });
  });

  it('sets the group class permission for an entity (setGroupClassPermission)', async () => {
    fetchMock = fetchSpy(successResponse(null));

    await expect(service.setGroupClassPermission(1909, 10, 'ADMIN')).resolves.not.toThrow();
  });

  it('throws an error if the group class permission for an entity ' +
    'couldn\'t be set (setGroupClassPermission)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.setGroupClassPermission(1909, 10, 'ADMIN')).rejects.toThrow();
  });

  it('sends all required parameters to delete the user instance ' +
    'permission for an entity (deleteUserInstancePermission)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.deleteUserInstancePermission(1909, 10);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/instance/user/10', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'DELETE'
    });
  });

  it('deletes the user instance permission for an entity (deleteUserInstancePermission)', async () => {
    fetchMock = fetchSpy(successResponse(null));

    await expect(service.deleteUserInstancePermission(1909, 10)).resolves.not.toThrow();
  });

  it('throws an error if the user instance permission for an entity ' +
    'couldn\'t be deleted (deleteUserInstancePermission)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.deleteUserInstancePermission(1909, 10)).rejects.toThrow();
  });

  it('sends all required parameters to delete the group instance ' +
    'permission for an entity (deleteGroupInstancePermission)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.deleteGroupInstancePermission(1909, 10);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/instance/group/10', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'DELETE'
    });
  });

  it('deletes the group instance permission for an entity (deleteGroupInstancePermission)', async () => {
    fetchMock = fetchSpy(successResponse(null));

    await expect(service.deleteGroupInstancePermission(1909, 10)).resolves.not.toThrow();
  });

  it('throws an error if the group instance permission for an entity ' +
    'couldn\'t be deleted (deleteGroupInstancePermission)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.deleteGroupInstancePermission(1909, 10)).rejects.toThrow();
  });

  it('sends all required parameters to delete the user class ' +
    'permission for an entity (deleteUserClassPermission)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.deleteUserClassPermission(1909, 10);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/class/user/10', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'DELETE'
    });
  });

  it('deletes the user class permission for an entity (deleteUserClassPermission)', async () => {
    fetchMock = fetchSpy(successResponse(null));

    await expect(service.deleteUserClassPermission(1909, 10)).resolves.not.toThrow();
  });

  it('throws an error if the user class permission for an entity ' +
    'couldn\'t be deleted (deleteUserClassPermission)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.deleteUserClassPermission(1909, 10)).rejects.toThrow();
  });

  it('sends all required parameters to delete the group class ' +
    'permission for an entity (deleteGroupClassPermission)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.deleteGroupClassPermission(1909, 10);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/class/group/10', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'DELETE'
    });
  });

  it('deletes the group class permission for an entity (deleteGroupClassPermission)', async () => {
    fetchMock = fetchSpy(successResponse(null));

    await expect(service.deleteGroupClassPermission(1909, 10)).resolves.not.toThrow();
  });

  it('throws an error if the group class permission for an entity ' +
    'couldn\'t be deleted (deleteGroupClassPermission)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.deleteGroupClassPermission(1909, 10)).rejects.toThrow();
  });

  it('sends all required parameters to delete all user instance ' +
    'permissions for an entity (deleteUserInstancePermissions)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.deleteUserInstancePermissions(1909);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/instance/user', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'DELETE'
    });
  });

  it('deletes all user instance permissions for an entity (deleteUserInstancePermissions)', async () => {
    fetchMock = fetchSpy(successResponse(null));

    await expect(service.deleteUserInstancePermissions(1909)).resolves.not.toThrow();
  });

  it('throws an error if the user instance permissions for an entity ' +
    'couldn\'t be deleted (deleteUserInstancePermissions)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.deleteUserInstancePermissions(1909)).rejects.toThrow();
  });

  it('sends all required parameters to delete all group instance ' +
    'permissions for an entity (deleteGroupInstancePermissions)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.deleteGroupInstancePermissions(1909);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/instance/group', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'DELETE'
    });
  });

  it('deletes all group instance permissions for an entity (deleteGroupInstancePermissions)', async () => {
    fetchMock = fetchSpy(successResponse(null));

    await expect(service.deleteGroupInstancePermissions(1909)).resolves.not.toThrow();
  });

  it('throws an error if the group instance permissions for an entity ' +
    'couldn\'t be deleted (deleteGroupInstancePermissions)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.deleteGroupInstancePermissions(1909)).rejects.toThrow();
  });

  it('sends all required parameters to delete all user class ' +
    'permissions for an entity (deleteUserClassPermissions)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.deleteUserClassPermissions(1909);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/class/user', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'DELETE'
    });
  });

  it('deletes all user class permissions for an entity (deleteUserClassPermissions)', async () => {
    fetchMock = fetchSpy(successResponse(null));

    await expect(service.deleteUserClassPermissions(1909)).resolves.not.toThrow();
  });

  it('throws an error if the user class permissions for an entity ' +
    'couldn\'t be deleted (deleteUserClassPermissions)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.deleteUserClassPermissions(1909)).rejects.toThrow();
  });

  it('sends all required parameters to delete all group class ' +
    'permissions for an entity (deleteGroupClassPermissions)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.deleteGroupClassPermissions(1909);

    expect(fetchMock).toHaveBeenCalledWith('/1909/permissions/class/group', {
      headers: {
        Authorization: 'Bearer ThisIsNotAValidBearerToken'
      },
      method: 'DELETE'
    });
  });

  it('deletes all group class permissions for an entity (deleteGroupClassPermissions)', async () => {
    fetchMock = fetchSpy(successResponse(null));

    await expect(service.deleteGroupClassPermissions(1909)).resolves.not.toThrow();
  });

  it('throws an error if the group class permissions for an entity ' +
    'couldn\'t be deleted (deleteGroupClassPermissions)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.deleteGroupClassPermissions(1909)).rejects.toThrow();
  });
});
