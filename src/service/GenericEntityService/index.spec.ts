import BaseEntity, { BaseEntityArgs } from '../../model/BaseEntity';
import fetchSpy, { failureResponse, successResponse } from '../../spec/fetchSpy';
import GenericService, { GenericEntityServiceOpts } from '.';
import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';

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
    super({ id, created, modified });

    this.dummyField = dummyField;
  }
}

class DummyService extends GenericService<DummyEntity> {
  constructor(opts: GenericEntityServiceOpts = {
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

  it('is defined', () => {
    expect(GenericService).toBeDefined();
  });

  it('sends all required parameters to return all entities (findAll)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.findAll();

    expect(fetchMock).toHaveBeenCalledWith('/dummy', {
      headers: {},
      method: 'GET'
    });
  });

  it('sends all required parameters to return all paged entities (findAll)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.findAll({
      page: 0
    });

    expect(fetchMock).toHaveBeenCalledWith('/dummy?page=0', {
      headers: {},
      method: 'GET'
    });

    fetchMock.mockClear();

    await service.findAll({
      page: 0,
      size: 10
    });

    expect(fetchMock).toHaveBeenCalledWith('/dummy?page=0&size=10', {
      headers: {},
      method: 'GET'
    });

    fetchMock.mockClear();

    await service.findAll({
      page: 0,
      size: 10,
      sort: {
        properties: ['a']
      }
    });

    expect(fetchMock).toHaveBeenCalledWith('/dummy?page=0&size=10&sort=a', {
      headers: {},
      method: 'GET'
    });

    fetchMock.mockClear();

    await service.findAll({
      page: 0,
      size: 10,
      sort: {
        properties: ['a', 'b']
      }
    });

    expect(fetchMock).toHaveBeenCalledWith('/dummy?page=0&size=10&sort=a%2Cb', {
      headers: {},
      method: 'GET'
    });

    fetchMock.mockClear();

    await service.findAll({
      page: 0,
      size: 10,
      sort: {
        properties: ['a', 'b'],
        order: 'asc'
      }
    });

    expect(fetchMock).toHaveBeenCalledWith('/dummy?page=0&size=10&sort=a%2Cb%2Casc', {
      headers: {},
      method: 'GET'
    });

    fetchMock.mockClear();

    await service.findAll({
      page: 0,
      size: 10,
      sort: {
        properties: ['a', 'b'],
        order: 'desc'
      }
    });

    expect(fetchMock).toHaveBeenCalledWith('/dummy?page=0&size=10&sort=a%2Cb%2Cdesc', {
      headers: {},
      method: 'GET'
    });
  });

  it('returns all entities (findAll)', async () => {
    const response = {
      content: [
        {
          id: 1
        },
        {
          id: 2
        }
      ]
    };

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

    await service.findOne(1);

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

  it('sends all required parameter to create an entity (add)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.add({ dummyField: 'dummyValue' });
    const csrfHeaderValue = CsrfUtil.getCsrfValue();
    expect(fetchMock).toHaveBeenCalledWith('/dummy', {
      body: '{\"dummyField\":\"dummyValue\"}',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfHeaderValue
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

    await expect(service.add({ dummyField: 'dummyValue' })).rejects.toThrow();
  });

  it('sends all required parameters to delete an entity (delete)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    const resp = await service.delete(1);
    const csrfHeaderValue = CsrfUtil.getCsrfValue();
    expect(fetchMock).toHaveBeenCalledWith('/dummy/1', {
      headers: {},
      method: 'DELETE'
    });
  });

  it('returns undefined/void (delete)', async () => {
    fetchMock = fetchSpy(successResponse());

    await expect(service.delete(1)).resolves.toBe(undefined);
  });

  it('throws an error if an entity couldn\'t be deleted (delete)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.delete(1)).rejects.toThrow();
  });

  it('sends all required parameters to update an entity (update)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.update({ id: 1, dummyField: 'dummyValue' });
    const csrfHeaderValue = CsrfUtil.getCsrfValue();
    expect(fetchMock).toHaveBeenCalledWith('/dummy/1', {
      body: '{\"id\":1,\"dummyField\":\"dummyValue\"}',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfHeaderValue
      },
      method: 'PUT'
    });
  });

  it('returns the updated entity (update)', async () => {
    const response = {
      id: 1
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.update(response);

    expect(resp).toEqual(response);
  });

  it('throws an error if an entity couldn\'t be updated (update)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.update({ dummyField: 'dummyValue' })).rejects.toThrow();
  });

  it('sends all required parameters to partially update an entity (updatePartial)', async () => {
    fetchMock = fetchSpy(successResponse([]));

    await service.updatePartial({ id: 1, dummyField: 'dummyValue' });
    const csrfHeaderValue = CsrfUtil.getCsrfValue();
    expect(fetchMock).toHaveBeenCalledWith('/dummy/1', {
      body: '{\"id\":1,\"dummyField\":\"dummyValue\"}',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfHeaderValue
      },
      method: 'PATCH'
    });
  });

  it('returns the updated entity (updatePartial)', async () => {
    const response = {
      id: 1
    };

    fetchMock = fetchSpy(successResponse(response));

    const resp = await service.updatePartial(response);

    expect(resp).toEqual(response);
  });

  it('throws an error if an entity couldn\'t be updated (updatePartial)', async () => {
    fetchMock = fetchSpy(failureResponse());

    await expect(service.updatePartial({ dummyField: 'dummyValue' })).rejects.toThrow();
  });
});
