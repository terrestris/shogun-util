import ImageFileService from '.';
import ImageFile from '../../model/ImageFile';
import GenericFileService from '../GenericFileService';

describe('ImageFileService', () => {
  let service: ImageFileService<ImageFile>;

  beforeEach(() => {
    service = new ImageFileService<ImageFile>();
  });

  it('is is defined', () => {
    expect(ImageFileService).toBeDefined();
  });

  it('extends the GenericFileService', () => {
    expect(service instanceof GenericFileService).toBeTruthy();
  });

});
