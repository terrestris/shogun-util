import BaseEntity from '../../model/BaseEntity';
import { Page } from '../../model/Page';
import { RevisionEntry, RevisionResponse } from '../../model/Revision';
import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';
import { GenericServiceOpts, PageOpts } from '../GenericService';
import PermissionService from '../PermissionService';

export type GenericEntityServiceOpts = GenericServiceOpts;

export abstract class GenericEntityService<T extends BaseEntity> extends PermissionService {

  constructor(opts: GenericEntityServiceOpts) {
    super(opts);
  }

  async findAllNoPaging(fetchOpts?: RequestInit): Promise<T[]> {
    const pageOpts: PageOpts = {
      page: 0,
      size: 10
    };
    let list: T[] = [];
    try {
      while (true) {
        const response = await fetch(this.getPageUrl(pageOpts), {
          method: 'GET',
          headers: {
            ...getBearerTokenHeader(this.keycloak)
          },
          ...fetchOpts
        });

        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }

        const result = await response.json() as Page<T>;
        list = list.concat(result.content);
        if ((pageOpts.page as number) < result.totalPages) {
          (pageOpts.page as number) += 1;
        } else {
          break;
        }
      }
      return list;
    } catch (error) {
      throw new Error(`Error while requesting all entities: ${error}`);
    }
  }

  async findAll(pageOpts?: PageOpts, fetchOpts?: RequestInit): Promise<Page<T>> {
    try {
      const response = await fetch(this.getPageUrl(pageOpts), {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      return await response.json() as Page<T>;
    } catch (error) {
      throw new Error(`Error while requesting all entities: ${error}`);
    }
  }

  async findAllRevisions(id: string | number, fetchOpts?: RequestInit): Promise<RevisionEntry<T>[]> {
    try {
      const response = await fetch(`${this.basePath}/${id}/rev`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      const json: RevisionResponse<T> = await response.json();

      return json.content;
    } catch (error) {
      throw new Error(`Error while requesting revisions: ${error}`);
    }
  }

  async findOne(id: string | number, fetchOpts?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.basePath}/${id}`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error while requesting a single entity: ${error}`);
    }
  }

  async findRevision(id: string | number, revision: number, fetchOpts?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.basePath}/${id}/rev/${revision}`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      const json: T = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while requesting a single entity revision: ${error}`);
    }
  }

  async add(t: T, fetchOpts?: RequestInit): Promise<T> {
    try {
      const response = await fetch(this.basePath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
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
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        body: JSON.stringify(t),
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      return await response.json();
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
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        body: JSON.stringify(t),
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error while updating an entity partially: ${error}`);
    }
  }

  async delete(id: string | number, fetchOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(`${this.basePath}/${id}`, {
        method: 'DELETE',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while deleting an entity: ${error}`);
    }
  }

  getBasePath(): string {
    return this.basePath;
  }

}

export default GenericEntityService;
