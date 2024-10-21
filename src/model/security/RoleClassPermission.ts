import Role from '../Role';

import ClassPermission, { ClassPermissionArgs } from './ClassPermission';

export interface RoleClassPermissionArgs extends ClassPermissionArgs {
  role: Role;
}

export default class RoleClassPermission extends ClassPermission {
  role: Role;

  constructor({ id, created, modified, className, permission, role }: RoleClassPermissionArgs) {
    super({ id, created, modified, className, permission });

    this.role = role;
  }
}
