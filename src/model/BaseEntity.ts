import _isNil from 'lodash/isNil';

export interface BaseEntityArgs {
  id?: number;
  created?: string | Date;
  modified?: string | Date;
}

export default class BaseEntity {
  id?: number;
  created?: Date;
  modified?: Date;

  constructor({id, created, modified}: BaseEntityArgs) {
    this.id = id;
    this.created = _isNil(created) ? created : new Date(created);
    this.modified = _isNil(modified) ? modified : new Date(modified);
  }
}
