import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';

import BaseEntity from '../../model/BaseEntity';

export type ReplacerFunction = (key: string, value: any) => any;

export interface GenericServiceOpts {
  basePath: string;
  replacer?: ReplacerFunction;
};

export abstract class GenericService<T extends BaseEntity> {

  clazz: string;

  basePath: string;

  replacer: ReplacerFunction | undefined;

  constructor(x: new (...newArgs: any[]) => T, opts: GenericServiceOpts) {
    this.clazz = x.name;
    this.basePath = opts.basePath;
    this.replacer = opts.replacer;
  }

  async findAll(requestOpts: RequestInit = {
    method: 'GET',
    headers: {
      'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie()
    }
  }): Promise<T[]> {
    try {
      const response = await fetch(this.basePath, requestOpts);

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: T[] = await response.json();

      return json ;
    } catch (error) {
      throw new Error(`Error while requesting all entities: ${error}`);
    }
  }

  async findOne(id: string | number, requestOpts: RequestInit = {
    method: 'GET',
    headers: {
      'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie()
    }
  }): Promise<T> {
    try {
      const response = await fetch(`${this.basePath}/${id}`, requestOpts);

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: T = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while requesting a single entity: ${error}`);
    }
  }

  async add(t: T, requestOpts: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie()
    },
    body: JSON.stringify(t, this.replacer)
  }): Promise<T> {
    try {
      const response = await fetch(this.basePath, requestOpts);

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: T = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while creating an entity: ${error}`);
    }
  }

  async update(t: T, requestOpts: RequestInit = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie()
    },
    body: JSON.stringify(t, this.replacer)
  }): Promise<T> {
    try {
      const response = await fetch(`${this.basePath}/${t.id}`, requestOpts);

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: T = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while updating an entity: ${error}`);
    }
  }

  async updatePartial(t: Partial<T>, requestOpts: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie()
    },
    body: JSON.stringify(t, this.replacer)
  }): Promise<T> {
    try {
      const response = await fetch(`${this.basePath}/${t.id}`, requestOpts);

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: T = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while updating an entity partially: ${error}`);
    }
  }

  async delete(id: string | number, requestOpts: RequestInit = {
    method: 'DELETE',
    headers: {
      'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie()
    }
  }): Promise<T> {
    try {
      const response = await fetch(`${this.basePath}/${id}`, requestOpts);

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: T = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while deleting an entity: ${error}`);
    }
  }

}

export default GenericService;
