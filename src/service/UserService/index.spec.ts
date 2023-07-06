import User from '../../model/User';
import GenericEntityService from '../GenericEntityService';
import UserService from '.';

describe('UserService', () => {
  let service: UserService<User>;

  beforeEach(() => {
    service = new UserService();
  });

  it('is defined', () => {
    expect(UserService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericEntityService).toBeTruthy();
  });

  it('has set the correct default path', () => {
    expect(service.getBasePath()).toEqual('/users');
  });

});
