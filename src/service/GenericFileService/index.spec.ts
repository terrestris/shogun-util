import BaseEntity, { BaseEntityArgs } from '../../model/BaseEntity';

import GenericFileService, { GenericFileServiceOpts } from '.';
import fetchSpy, { failureResponse, successResponse } from '../../spec/fetchSpy';

interface DummyEntityArgs extends BaseEntityArgs {
  dummyField?: string;
}

class DummyEntity extends BaseEntity {
  dummyField?: string;

  constructor({
    id,
    created,
    modified,
    dummyField
  }: DummyEntityArgs) {
    super({id, created, modified});

    this.dummyField = dummyField;
  }
};

class DummyService extends GenericFileService<DummyEntity> {
  constructor(opts: GenericFileServiceOpts = {
    basePath: '/dummy'
  }) {
    super(opts);
  }
}

describe('GenericFileService', () => {
  let fetchMock: jest.SpyInstance;
  let service: DummyService;

  beforeEach(() => {
    service = new DummyService();
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is defined', () => {
    expect(GenericFileService).toBeDefined();
  });

  it('sends all required parameters to return all entities (findAll)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.findAll();

    expect(fetchMock).toHaveBeenCalledWith('/dummy', {
      headers: {},
      method: 'GET'
    });
  });

  it('returns all entities (findAll)', async () => {
    const response = [{
      id: 1
    }, {
      id: 2
    }];

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.findAll();

    expect(resp).toEqual(response);
  });

  it('throws an error if all entities couldn\'t be fetched (findAll)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.findAll()).rejects.toThrow();
  });

  it('sends all required parameters to return a single entity (findOne)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.findOne('db5f69fa-e8f6-42a6-a305-d2555d7d4d08');

    expect(fetchMock).toHaveBeenCalledWith('/dummy/db5f69fa-e8f6-42a6-a305-d2555d7d4d08', {
      headers: {},
      method: 'GET'
    });
  });

  it('returns a single entity (findOne)', async () => {
    const response = new Blob();

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.findOne('db5f69fa-e8f6-42a6-a305-d2555d7d4d08');

    expect(resp).toEqual(response);
  });

  it('throws an error if a single entity couldn\'t be fetched (findOne)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.findOne('db5f69fa-e8f6-42a6-a305-d2555d7d4d08')).rejects.toThrow();
  });

  it('sends all required parameter to create an entity (upload)', async () => {
    fetchMock = fetchSpy(successResponse([]));
    const file = new File([''], 'filename', {type: 'text/html'});

    await service.upload(file);

    const body = new FormData();
    body.append('file', file);

    expect(fetchMock).toHaveBeenCalledWith('/dummy/upload', {
      body: body,
      headers: {},
      method: 'POST'
    });
  });

  it('sends all required parameter to create an entity on disk (upload)', async () => {
    fetchMock = fetchSpy(successResponse([]));
    const file = new File([''], 'filename', {type: 'text/html'});

    await service.upload(file, true);

    const body = new FormData();
    body.append('file', file);

    expect(fetchMock).toHaveBeenCalledWith('/dummy/uploadToFileSystem', {
      body: body,
      headers: {},
      method: 'POST'
    });
  });

  it('returns the created entity (upload)', async () => {
    const response = {
      id: 1
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.upload(new File([''], 'filename', {type: 'text/html'}));

    expect(resp).toEqual(response);
  });

  it('throws an error if an entity couldn\'t be created (upload)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.upload(new File([''], 'filename', {type: 'text/html'}))).rejects.toThrow();
  });

  it('sends all required parameters to delete an entity (delete)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.delete('db5f69fa-e8f6-42a6-a305-d2555d7d4d08');

    expect(fetchMock).toHaveBeenCalledWith('/dummy/db5f69fa-e8f6-42a6-a305-d2555d7d4d08', {
      headers: {},
      method: 'DELETE'
    });
  });

  it('returns undefined/void (delete)', async () => {
    fetchMock = fetchSpy(successResponse());

    await expect(service.delete('db5f69fa-e8f6-42a6-a305-d2555d7d4d08')).resolves.toBe(undefined);
  });

  it('throws an error if an entity couldn\'t be deleted (delete)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.delete('db5f69fa-e8f6-42a6-a305-d2555d7d4d08')).rejects.toThrow();
  });
});
