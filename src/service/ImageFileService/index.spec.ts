import ImageFile from '../../model/ImageFile';
import fetchSpy, { failureResponse, successResponse } from '../../spec/fetchSpy';
import GenericFileService from '../GenericFileService';
import ImageFileService from '.';

describe('ImageFileService', () => {
  let fetchMock: jest.SpyInstance;
  let service: ImageFileService<ImageFile>;

  beforeEach(() => {
    service = new ImageFileService<ImageFile>();
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is defined', () => {
    expect(ImageFileService).toBeDefined();
  });

  it('extends the GenericFileService', () => {
    expect(service instanceof GenericFileService).toBeTruthy();
  });

  it('has set the correct default path', () => {
    expect(service.basePath).toEqual('/imagefiles');
  });


  it('sends all required parameters to return a single entity (findOneThumbnail)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.findOneThumbnail('db5f69fa-e8f6-42a6-a305-d2555d7d4d08');

    expect(fetchMock).toHaveBeenCalledWith('/imagefiles/db5f69fa-e8f6-42a6-a305-d2555d7d4d08/thumbnail', {
      headers: {},
      method: 'GET'
    });
  });

  it('returns a single entity (findOneThumbnail)', async () => {
    const response = new Blob();

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.findOneThumbnail('db5f69fa-e8f6-42a6-a305-d2555d7d4d08');

    expect(resp).toEqual(response);
  });

  it('throws an error if a single entity couldn\'t be fetched (findOneThumbnail)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.findOneThumbnail('db5f69fa-e8f6-42a6-a305-d2555d7d4d08')).rejects.toThrow();
  });

});
