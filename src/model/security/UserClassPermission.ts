import User from '../User';

import ClassPermission, { ClassPermissionArgs } from './ClassPermission';

export interface UserClassPermissionArgs extends ClassPermissionArgs {
  user: User;
}

export default class UserClassPermission extends ClassPermission {
  user: User;

  constructor({ id, created, modified, className, permission, user }: UserClassPermissionArgs) {
    super({ id, created, modified, className, permission });

    this.user = user;
  }
}
