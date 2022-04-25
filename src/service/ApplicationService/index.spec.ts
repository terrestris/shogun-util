import Application from '../../model/Application';

import ApplicationService from '.';
import GenericService from '../GenericService';

describe('ApplicationService', () => {
  let service: ApplicationService<Application>;

  beforeEach(() => {
    service = new ApplicationService<Application>();
  });

  it('is is defined', () => {
    expect(ApplicationService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericService).toBeTruthy();
  });

});
