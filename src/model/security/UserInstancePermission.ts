import User from '../User';

import InstancePermission, { InstancePermissionArgs } from './InstancePermission';

export interface UserInstancePermissionArgs extends InstancePermissionArgs {
  user: User;
}

export default class UserInstancePermission extends InstancePermission {
  user: User;

  constructor({ id, created, modified, entityId, permission, user }: UserInstancePermissionArgs) {
    super({ id, created, modified, entityId, permission });

    this.user = user;
  }
}
