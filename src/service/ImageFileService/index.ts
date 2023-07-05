import ImageFile from '../../model/ImageFile';
import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';
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
          ...getCsrfTokenHeader()
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

}

export default ImageFileService;
