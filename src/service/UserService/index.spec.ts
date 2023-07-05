import User, { KeycloakUserRepresentation } from '../../model/User';
import GenericService from '../GenericService';
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
    expect(service instanceof GenericService).toBeTruthy();
  });

  it('has set the correct default path', () => {
    expect(service.basePath).toEqual('/users');
  });

});
