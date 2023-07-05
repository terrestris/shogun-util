import File from '../../model/File';
import GenericFileService from '../GenericFileService';
import FileService from '.';

describe('FileService', () => {
  let service: FileService<File>;

  beforeEach(() => {
    service = new FileService<File>();
  });

  it('is defined', () => {
    expect(FileService).toBeDefined();
  });

  it('extends the GenericFileService', () => {
    expect(service instanceof GenericFileService).toBeTruthy();
  });

  it('has set the correct default path', () => {
    expect(service.getBasePath()).toEqual('/files');
  });

});
