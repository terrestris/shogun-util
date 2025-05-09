import PermissionCollectionType from '../../model/enum/PermissionCollectionType';
import GroupClassPermission from '../../model/security/GroupClassPermission';
import GroupInstancePermission from '../../model/security/GroupInstancePermission';
import RoleClassPermission from '../../model/security/RoleClassPermission';
import RoleInstancePermission from '../../model/security/RoleInstancePermission';
import UserClassPermission from '../../model/security/UserClassPermission';
import UserInstancePermission from '../../model/security/UserInstancePermission';
import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';
import { GenericService, GenericServiceOpts } from '../GenericService';

export type PermissionServiceOpts = GenericServiceOpts;

export class PermissionService extends GenericService {

  constructor(opts: PermissionServiceOpts) {
    super(opts);
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

      return await response.json();
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

      return await response.json();
    } catch (error) {
      throw new Error(`Error while requesting the group instance permissions: ${error}`);
    }
  }

  async getRoleInstancePermissions(id: string | number, fetchOpts?: RequestInit): Promise<RoleInstancePermission[]> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/role`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error while requesting the role instance permissions: ${error}`);
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

      return await response.json();
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

      return await response.json();
    } catch (error) {
      throw new Error(`Error while requesting the group class permissions: ${error}`);
    }
  }

  async getRoleClassPermissions(id: string | number, fetchOpts?: RequestInit): Promise<RoleClassPermission[]> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/role`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error while requesting the role class permissions: ${error}`);
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

      return await response.json();
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

      return await response.json();
    } catch (error) {
      throw new Error(`Error while requesting the group instance permission: ${error}`);
    }
  }

  async getRoleInstancePermission(id: string | number, roleId: string | number, fetchOpts?: RequestInit):
    Promise<RoleInstancePermission> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/role/${roleId}`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error while requesting the role instance permission: ${error}`);
    }
  }

  async getUserClassPermission(id: string | number, userId: string | number, fetchOpts?: RequestInit):
    Promise<UserClassPermission> {
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

      return await response.json();
    } catch (error) {
      throw new Error(`Error while requesting the user class permission: ${error}`);
    }
  }

  async getGroupClassPermission(id: string | number, groupId: string | number, fetchOpts?: RequestInit):
    Promise<UserClassPermission> {
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

      return await response.json();
    } catch (error) {
      throw new Error(`Error while requesting the group class permission: ${error}`);
    }
  }

  async getRoleClassPermission(id: string | number, roleId: string | number, fetchOpts?: RequestInit):
    Promise<RoleClassPermission> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/role/${roleId}`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error while requesting the role class permission: ${error}`);
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

  async setRoleInstancePermission(id: string | number, roleId: string | number,
    permissionType: PermissionCollectionType, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/role/${roleId}`, {
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
      throw new Error(`Error while adding the role instance permission: ${error}`);
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

  async setRoleClassPermission(id: string | number, roleId: string | number,
    permissionType: PermissionCollectionType, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/role/${roleId}`, {
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
      throw new Error(`Error while adding the role class permission: ${error}`);
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

  async deleteRoleInstancePermission(id: string | number, roleId: string | number,
    fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/role/${roleId}`, {
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
      throw new Error(`Error while removing the role instance permission: ${error}`);
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

  async deleteRoleClassPermission(id: string | number, roleId: string | number,
    fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/role/${roleId}`, {
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
      throw new Error(`Error while removing the role class permission: ${error}`);
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

  async deleteRoleInstancePermissions(id: string | number, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/instance/role`, {
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
      throw new Error(`Error while removing all role instance permissions: ${error}`);
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

  async deleteRoleClassPermissions(id: string | number, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/class/role`, {
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
      throw new Error(`Error while removing all role class permissions: ${error}`);
    }
  }

  async isPublic(id: string | number, fetchOpts?: RequestInit): Promise<boolean> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/public`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });
      const result = await response.json();
      return result.public;
    } catch (error) {
      throw new Error(`Error while checking if an entity is public: ${error}`);
    }
  }

  async setPublic(id: string | number, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/public`, {
        method: 'POST',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while setting an entity as public: ${error}`);
    }
  }

  async revokePublic(id: string | number, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}/permissions/public`, {
        method: 'DELETE',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while setting an entity as not public: ${error}`);
    }
  }
}

export default PermissionService;
