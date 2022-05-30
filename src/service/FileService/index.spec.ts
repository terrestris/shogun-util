import FileService from '.';
import File from '../../model/File';
import GenericFileService from '../GenericFileService';

describe('FileService', () => {
  let service: FileService<File>;

  beforeEach(() => {
    service = new FileService<File>();
  });

  it('is is defined', () => {
    expect(FileService).toBeDefined();
  });

  it('extends the GenericFileService', () => {
    expect(service instanceof GenericFileService).toBeTruthy();
  });

});
