import SHOGunFile from '../../model/File';
import { Page } from '../../model/Page';
import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';
import { GenericServiceOpts, PageOpts } from '../GenericService';
import PermissionService from '../PermissionService';

export type GenericFileServiceOpts = GenericServiceOpts;

export abstract class GenericFileService<T extends SHOGunFile> extends PermissionService {

  protected constructor(opts: GenericFileServiceOpts) {
    super(opts);
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

      return await response.blob();
    } catch (error) {
      throw new Error(`Error while requesting a single entity: ${error}`);
    }
  }

  async upload(file: File, fileSystem = false, fetchOpts?: RequestInit): Promise<T> {
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

      return await response.json();
    } catch (error) {
      throw new Error(`Error while creating an entity: ${error}`);
    }
  }

  async delete(fileUuid: string, fetchOpts?: RequestInit): Promise<void> {
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
    } catch (error) {
      throw new Error(`Error while deleting an entity: ${error}`);
    }
  }

  getBasePath() {
    return this.basePath;
  }

}

export default GenericFileService;
