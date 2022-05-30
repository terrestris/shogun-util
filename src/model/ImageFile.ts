import File, { FileArgs } from './File';

export interface ImageFileArgs extends FileArgs {
  width?: number;
  height?: number;
}

export default class ImageFile extends File {
  width?: number;
  height?: number;

  constructor({ id, created, modified, active, fileName, fileType, fileUuid, height, width }: ImageFileArgs) {
    super({ id, created, modified, active, fileName, fileType, fileUuid });

    this.width = width;
    this.height = height;
  }
}
