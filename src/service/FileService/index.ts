import File from '../../model/File';

import GenericFileService, { GenericFileServiceOpts } from '../GenericFileService';

export class FileService<T extends File> extends GenericFileService<T> {

  constructor(opts: GenericFileServiceOpts = {
    basePath: '/files'
  }) {
    super(opts);
  }

}

export default FileService;
