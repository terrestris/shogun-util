import Keycloak from 'keycloak-js';

import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';

import SHOGunFile from '../../model/File';

export interface GenericFileServiceOpts {
  basePath: string;
  keycloak?: Keycloak;
};

export abstract class GenericFileService<T extends SHOGunFile> {

  basePath: string;

  keycloak?: Keycloak;

  constructor(opts: GenericFileServiceOpts) {
    this.basePath = opts.basePath;
    this.keycloak = opts.keycloak;
  }

  async findAll(fetchOpts?: RequestInit): Promise<T[]> {
    try {
      const response = await fetch(this.basePath, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
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

  async findOne(fileUuid: string, fetchOpts?: RequestInit): Promise<Blob> {
    try {
      const response = await fetch(`${this.basePath}/${fileUuid}`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const blob: Blob = await response.blob();

      return blob;
    } catch (error) {
      throw new Error(`Error while requesting a single entity: ${error}`);
    }
  }

  async upload(file: File, fileSystem: boolean = false, fetchOpts?: RequestInit): Promise<T> {
    try {
      const formData  = new FormData();

      formData.append('file', file);

      const response = await fetch(`${this.basePath}/${fileSystem ? 'uploadToFileSystem' : 'upload'}`, {
        method: 'POST',
        headers: {
          ...getCsrfTokenHeader(),
          ...getBearerTokenHeader(this.keycloak)
        },
        body: formData,
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

  async delete(fileUuid: string, fetchOpts?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.basePath}/${fileUuid}`, {
        method: 'DELETE',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
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

export default GenericFileService;
