import Application from '../../model/Application';
import GenericEntityService from '../GenericEntityService';
import ApplicationService from '.';

describe('ApplicationService', () => {
  let service: ApplicationService<Application>;

  beforeEach(() => {
    service = new ApplicationService<Application>();
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
