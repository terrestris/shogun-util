import Role from '../../model/Role';
import GenericEntityService from '../GenericEntityService';
import RoleService from '.';

describe('RoleService', () => {
  let service: RoleService<Role>;

  beforeEach(() => {
    service = new RoleService();
  });

  it('is defined', () => {
    expect(RoleService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericEntityService).toBeTruthy();
  });

  it('has set the correct default path', () => {
    expect(service.getBasePath()).toEqual('/roles');
  });

});
