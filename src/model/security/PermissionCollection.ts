import BaseEntity, { BaseEntityArgs } from '../BaseEntity';
import PermissionCollectionType from '../enum/PermissionCollectionType';
import PermissionType from '../enum/PermissionType';

export interface PermissionCollectionArgs extends BaseEntityArgs {
  permissions: PermissionType[];
  name: PermissionCollectionType;
}

export default class PermissionCollection extends BaseEntity {
  permissions: PermissionType[];
  name: PermissionCollectionType;

  constructor({ id, created, modified, permissions, name }: PermissionCollectionArgs) {
    super({ id, created, modified });

    this.permissions = permissions;
    this.name = name;
  }
}
