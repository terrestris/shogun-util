import BaseEntity, { BaseEntityArgs } from './BaseEntity';

export interface FileArgs extends BaseEntityArgs {
  fileUuid?: string;
  active?: boolean;
  fileName?: string;
  fileType?: string;
}

export default class File extends BaseEntity {
  fileUuid?: string;
  active?: boolean;
  fileName?: string;
  fileType?: string;

  constructor({ id, created, modified, fileUuid, active, fileName, fileType }: FileArgs) {
    super({ id, created, modified });

    this.fileUuid = fileUuid;
    this.active = active;
    this.fileName = fileName;
    this.fileType = fileType;
  }
}
