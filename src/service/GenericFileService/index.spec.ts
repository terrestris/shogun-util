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

  it('is is defined', () => {
    expect(GenericFileService).toBeDefined();
  });

  it('findAll GET', async () => {
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

  it('findOne GET', async () => {
    fetchMock = fetchSpy(successResponse([]));

    const resp = await service.findOne('db5f69fa-e8f6-42a6-a305-d2555d7d4d08');

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

  it('add POST', async () => {
    fetchMock = fetchSpy(successResponse([]));

    const resp = await service.upload(new File([''], 'filename', {type: 'text/html'}));

    expect(fetchMock).toHaveBeenCalledWith('/dummy/upload', {
      body: new FormData(),
      headers: {},
      method: 'POST'
    });
  });

  it('returns the created entity (add)', async () => {
    const response = {
      id: 1
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.upload(new File([''], 'filename', {type: 'text/html'}));

    expect(resp).toEqual(response);
  });

  it('throws an error if an entity couldn\'t be created (add)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.upload(new File([''], 'filename', {type: 'text/html'}))).rejects.toThrow();
  });

  it('delete DELETE', async () => {
    fetchMock = fetchSpy(successResponse([]));

    const resp = await service.delete('db5f69fa-e8f6-42a6-a305-d2555d7d4d08');

    expect(fetchMock).toHaveBeenCalledWith('/dummy/db5f69fa-e8f6-42a6-a305-d2555d7d4d08', {
      headers: {},
      method: 'DELETE'
    });
  });

  it('delete', async () => {
    const response = {
      id: 1
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.delete('db5f69fa-e8f6-42a6-a305-d2555d7d4d08');

    expect(resp).toEqual(response);
  });

  it('throws an error if an entity couldn\'t be deleted (delete)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.delete('db5f69fa-e8f6-42a6-a305-d2555d7d4d08')).rejects.toThrow();
  });
});
