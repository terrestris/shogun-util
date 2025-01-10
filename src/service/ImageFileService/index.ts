import ImageFile from '../../model/ImageFile';
import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import GenericFileService, { GenericFileServiceOpts } from '../GenericFileService';

export class ImageFileService<T extends ImageFile> extends GenericFileService<T> {

  constructor(opts: GenericFileServiceOpts = {
    basePath: '/imagefiles'
  }) {
    super(opts);
  }

  async findOneThumbnail(fileUuid: string, fetchOpts?: RequestInit): Promise<Blob> {
    try {
      const response = await fetch(`${this.basePath}/${fileUuid}/thumbnail`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak),
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

}

export default ImageFileService;
