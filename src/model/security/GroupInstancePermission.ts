import Group from '../Group';

import InstancePermission, { InstancePermissionArgs } from './InstancePermission';

export interface GroupInstancePermissionArgs extends InstancePermissionArgs {
  group: Group;
}

export default class GroupInstancePermission extends InstancePermission {
  group: Group;

  constructor({ id, created, modified, entityId, permission, group }: GroupInstancePermissionArgs) {
    super({ id, created, modified, entityId, permission });

    this.group = group;
  }
}
