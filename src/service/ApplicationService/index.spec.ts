import Application from '../../model/Application';
import GenericEntityService from '../GenericEntityService';
import ApplicationService from '.';

describe('ApplicationService', () => {
  let service: ApplicationService<Application>;
  const mockApplication = { id: 123, name: 'TestApp' } as Application;

  beforeEach(() => {
    service = new ApplicationService<Application>();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the application when the fetch is successful', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockApplication),
    });

    const result = await service.findOneByName('TestApp');

    expect(fetch).toHaveBeenCalledWith('/applications/name/TestApp', expect.objectContaining({
      method: 'GET',
      headers: expect.any(Object),
    }));
    expect(result).toEqual(mockApplication);
  });

  it('should throw an error when the response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(service.findOneByName('NonExistentApp')).rejects.toThrow('HTTP error status: 404');
    expect(fetch).toHaveBeenCalledWith('/applications/name/NonExistentApp', expect.objectContaining({
      method: 'GET',
      headers: expect.any(Object),
    }));
  });

  it('should throw an error when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(service.findOneByName('TestApp')).rejects.toThrow('Error while requesting a single entity: Error: Network error');
    expect(fetch).toHaveBeenCalledWith('/applications/name/TestApp', expect.objectContaining({
      method: 'GET',
      headers: expect.any(Object),
    }));
  });

  it('should return the application when the fetch is successful', async () => {
    const mockApplication = { id: 123, name: 'TestApp' } as Application;

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockApplication),
    });

    const result = await service.findOneByName('TestApp');

    expect(fetch).toHaveBeenCalledWith('/applications/name/TestApp', expect.objectContaining({
      method: 'GET',
      headers: expect.any(Object),
    }));

    expect(result).toEqual(mockApplication);
    expect(result.name).toBe('TestApp');
  });

  it('is defined', () => {
    expect(ApplicationService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericEntityService).toBeTruthy();
  });

  it('has set the correct default path', () => {
    expect(service.getBasePath()).toEqual('/applications');
  });

});
