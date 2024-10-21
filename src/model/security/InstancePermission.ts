import BaseEntity, { BaseEntityArgs } from '../BaseEntity';

import PermissionCollection from './PermissionCollection';

export interface InstancePermissionArgs extends BaseEntityArgs {
  entityId: number;
  permission: PermissionCollection;
}

export default class InstancePermission extends BaseEntity {
  entityId: number;
  permission: PermissionCollection;

  constructor({ id, created, modified, entityId, permission }: InstancePermissionArgs) {
    super({ id, created, modified });

    this.entityId = entityId;
    this.permission = permission;
  }
}
