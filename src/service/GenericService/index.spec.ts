import BaseEntity, { BaseEntityArgs } from '../../model/BaseEntity';

import GenericService, { GenericServiceOpts } from '.';
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

class DummyService extends GenericService<DummyEntity> {
  constructor(opts: GenericServiceOpts = {
    basePath: '/dummy'
  }) {
    super(opts);
  }
}

describe('GenericService', () => {
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
    expect(GenericService).toBeDefined();
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

    const resp = await service.findOne(1);

    expect(fetchMock).toHaveBeenCalledWith('/dummy/1', {
      headers: {},
      method: 'GET'
    });
  });

  it('returns a single entity (findOne)', async () => {
    const response = {
      id: 1
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.findOne(1);

    expect(resp).toEqual(response);
  });

  it('throws an error if a single entity couldn\'t be fetched (findOne)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.findOne(1)).rejects.toThrow();
  });

  it('add POST', async () => {
    fetchMock = fetchSpy(successResponse([]));

    const resp = await service.add({dummyField: 'dummyValue'});

    expect(fetchMock).toHaveBeenCalledWith('/dummy', {
      body: '{\"dummyField\":\"dummyValue\"}',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
  });

  it('returns the created entity (add)', async () => {
    const response = {
      id: 1
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.add(response);

    expect(resp).toEqual(response);
  });

  it('throws an error if an entity couldn\'t be created (add)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.add({dummyField: 'dummyValue'})).rejects.toThrow();
  });

  it('delete DELETE', async () => {
    fetchMock = fetchSpy(successResponse([]));

    const resp = await service.delete(1);

    expect(fetchMock).toHaveBeenCalledWith('/dummy/1', {
      headers: {},
      method: 'DELETE'
    });
  });

  it('delete', async () => {
    const response = {
      id: 1
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.delete(1);

    expect(resp).toEqual(response);
  });

  it('throws an error if an entity couldn\'t be deleted (delete)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.delete(1)).rejects.toThrow();
  });

  it('update PUT', async () => {
    fetchMock = fetchSpy(successResponse([]));

    const resp = await service.update({id: 1, dummyField: 'dummyValue'});

    expect(fetchMock).toHaveBeenCalledWith('/dummy/1', {
      body: '{\"id\":1,\"dummyField\":\"dummyValue\"}',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT'
    });
  });

  it('update', async () => {
    const response = {
      id: 1
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.update(response);

    expect(resp).toEqual(response);
  });

  it('throws an error if an entity couldn\'t be updated (update)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.update({dummyField: 'dummyValue'})).rejects.toThrow();
  });

  it('updatePartial PATCH', async () => {
    fetchMock = fetchSpy(successResponse([]));

    const resp = await service.updatePartial({id: 1, dummyField: 'dummyValue'});

    expect(fetchMock).toHaveBeenCalledWith('/dummy/1', {
      body: '{\"id\":1,\"dummyField\":\"dummyValue\"}',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH'
    });
  });

  it('updatePartial', async () => {
    const response = {
      id: 1
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.updatePartial(response);

    expect(resp).toEqual(response);
  });

  it('throws an error if an entity couldn\'t be updated (updatePartial)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.updatePartial({dummyField: 'dummyValue'})).rejects.toThrow();
  });
});
