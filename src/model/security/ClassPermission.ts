import BaseEntity, { BaseEntityArgs } from '../BaseEntity';
import PermissionCollection from './PermissionCollection';

export interface ClassPermissionArgs extends BaseEntityArgs {
  className: string;
  permission: PermissionCollection;
}

export default class ClassPermission extends BaseEntity {
  className: string;
  permission: PermissionCollection;

  constructor({ id, created, modified, className, permission }: ClassPermissionArgs) {
    super({ id, created, modified });

    this.className = className;
    this.permission = permission;
  }
}
