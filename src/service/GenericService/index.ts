import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';

import BaseEntity from '../../model/BaseEntity';

export interface GenericServiceOpts {
  basePath: string;
};

export abstract class GenericService<T extends BaseEntity> {

  private basePath: string;

  constructor(opts: GenericServiceOpts) {
    this.basePath = opts.basePath;
  }

  async findAll(fetchOpts?: RequestInit): Promise<T[]> {
    try {
      const response = await fetch(this.basePath, {
        method: 'GET',
        headers: {
          ...getCsrfTokenHeader()
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: T[] = await response.json();

      return json ;
    } catch (error) {
      throw new Error(`Error while requesting all entities: ${error}`);
    }
  }

  async findOne(id: string | number, fetchOpts?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.basePath}/${id}`, {
        method: 'GET',
        headers: {
          ...getCsrfTokenHeader()
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: T = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while requesting a single entity: ${error}`);
    }
  }

  async add(t: T, fetchOpts?: RequestInit): Promise<T> {
    try {
      const response = await fetch(this.basePath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfTokenHeader()
        },
        body: JSON.stringify(t),
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: T = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while creating an entity: ${error}`);
    }
  }

  async update(t: T, fetchOpts?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.basePath}/${t.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfTokenHeader()
        },
        body: JSON.stringify(t),
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: T = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while updating an entity: ${error}`);
    }
  }

  async updatePartial(t: Partial<T>, fetchOpts?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.basePath}/${t.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfTokenHeader()
        },
        body: JSON.stringify(t),
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json: T = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while updating an entity partially: ${error}`);
    }
  }

  async delete(id: string | number, fetchOpts?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.basePath}/${id}`, {
        method: 'DELETE',
        headers: {
          ...getCsrfTokenHeader()
        },
        ...fetchOpts
      });

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
