import Keycloak from 'keycloak-js';

import PermissionCollectionType from '../../model/enum/PermissionCollectionType';
import GroupClassPermission from '../../model/security/GroupClassPermission';
import GroupInstancePermission from '../../model/security/GroupInstancePermission';
import UserClassPermission from '../../model/security/UserClassPermission';
import UserInstancePermission from '../../model/security/UserInstancePermission';
import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';

export interface PermissionServiceOpts {
  basePath: string;
  keycloak?: Keycloak;
}

export class PermissionService {

  basePath: string;

  keycloak?: Keycloak;

  constructor(opts: PermissionServiceOpts) {
    this.basePath = opts.basePath;
    this.keycloak = opts.keycloak;
  }

  async getUserInstancePermissions(id: string | number, fetchOpts?: RequestInit): Promise<UserInstancePermission[]> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/user`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: UserInstancePermission[] = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while requesting the user instance permissions: ${error}`);
    }
  }

  async getGroupInstancePermissions(id: string | number, fetchOpts?: RequestInit): Promise<GroupInstancePermission[]> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/group`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: GroupInstancePermission[] = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while requesting the group instance permissions: ${error}`);
    }
  }

  async getUserClassPermissions(id: string | number, fetchOpts?: RequestInit): Promise<UserClassPermission[]> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/user`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: UserClassPermission[] = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while requesting the user class permissions: ${error}`);
    }
  }

  async getGroupClassPermissions(id: string | number, fetchOpts?: RequestInit): Promise<GroupClassPermission[]> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/group`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: GroupClassPermission[] = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while requesting the group class permissions: ${error}`);
    }
  }

  async getUserInstancePermission(id: string | number, userId: string | number, fetchOpts?: RequestInit):
    Promise<UserInstancePermission> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/user/${userId}`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: UserInstancePermission = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while requesting the user instance permission: ${error}`);
    }
  }

  async getGroupInstancePermission(id: string | number, groupId: string | number, fetchOpts?: RequestInit):
    Promise<UserInstancePermission> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/group/${groupId}`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: UserInstancePermission = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while requesting the group instance permission: ${error}`);
    }
  }

  async getUserClassPermission(id: string | number, userId: string | number, fetchOpts?: RequestInit):
    Promise<UserInstancePermission> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/user/${userId}`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: UserInstancePermission = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while requesting the user class permission: ${error}`);
    }
  }

  async getGroupClassPermission(id: string | number, groupId: string | number, fetchOpts?: RequestInit):
    Promise<UserInstancePermission> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/group/${groupId}`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: UserInstancePermission = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while requesting the group class permission: ${error}`);
    }
  }

  async setUserInstancePermission(id: string | number, userId: string | number,
    permissionType: PermissionCollectionType, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        body: JSON.stringify({
          permission: permissionType
        }),
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while adding the user instance permission: ${error}`);
    }
  }

  async setGroupInstancePermission(id: string | number, groupId: string | number,
    permissionType: PermissionCollectionType, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/group/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        body: JSON.stringify({
          permission: permissionType
        }),
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while adding the group instance permission: ${error}`);
    }
  }

  async setUserClassPermission(id: string | number, userId: string | number,
    permissionType: PermissionCollectionType, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        body: JSON.stringify({
          permission: permissionType
        }),
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while adding the user class permission: ${error}`);
    }
  }

  async setGroupClassPermission(id: string | number, groupId: string | number,
    permissionType: PermissionCollectionType, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/group/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        body: JSON.stringify({
          permission: permissionType
        }),
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while adding the group class permission: ${error}`);
    }
  }

  async deleteUserInstancePermission(id: string | number, userId: string | number,
    fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/user/${userId}`, {
        method: 'DELETE',
        headers: {
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while removing the user instance permission: ${error}`);
    }
  }

  async deleteGroupInstancePermission(id: string | number, groupId: string | number,
    fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/group/${groupId}`, {
        method: 'DELETE',
        headers: {
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while removing the group instance permission: ${error}`);
    }
  }

  async deleteUserClassPermission(id: string | number, userId: string | number,
    fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/user/${userId}`, {
        method: 'DELETE',
        headers: {
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while removing the user class permission: ${error}`);
    }
  }

  async deleteGroupClassPermission(id: string | number, groupId: string | number,
    fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/group/${groupId}`, {
        method: 'DELETE',
        headers: {
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while removing the group class permission: ${error}`);
    }
  }

  async deleteUserInstancePermissions(id: string | number, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/user`, {
        method: 'DELETE',
        headers: {
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while removing all user instance permissions: ${error}`);
    }
  }

  async deleteGroupInstancePermissions(id: string | number, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/group`, {
        method: 'DELETE',
        headers: {
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while removing all group instance permissions: ${error}`);
    }
  }

  async deleteUserClassPermissions(id: string | number, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/user`, {
        method: 'DELETE',
        headers: {
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while removing all user class permissions: ${error}`);
    }
  }

  async deleteGroupClassPermissions(id: string | number, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/group`, {
        method: 'DELETE',
        headers: {
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while removing all group class permissions: ${error}`);
    }
  }

}

export default PermissionService;
