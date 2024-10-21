import Role from '../Role';

import InstancePermission, { InstancePermissionArgs } from './InstancePermission';

export interface RoleInstancePermissionArgs extends InstancePermissionArgs {
  role: Role;
}

export default class RoleInstancePermission extends InstancePermission {
  role: Role;

  constructor({ id, created, modified, entityId, permission, role }: RoleInstancePermissionArgs) {
    super({ id, created, modified, entityId, permission });

    this.role = role;
  }
}
