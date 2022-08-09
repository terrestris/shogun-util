import Group from '../Group';
import ClassPermission, { ClassPermissionArgs } from './ClassPermission';

export interface GroupClassPermissionArgs extends ClassPermissionArgs {
  group: Group;
}

export default class GroupClassPermission extends ClassPermission {
  group: Group;

  constructor({ id, created, modified, className, permission, group }: GroupClassPermissionArgs) {
    super({ id, created, modified, className, permission });

    this.group = group;
  }
}
