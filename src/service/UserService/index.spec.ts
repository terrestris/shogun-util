import UserService from '.';
import User, { KeycloakUserRepresentation } from '../../model/User';
import GenericService from '../GenericService';

describe('UserService', () => {
  let service: UserService<User>;

  beforeEach(() => {
    service = new UserService();
  });

  it('is is defined', () => {
    expect(UserService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericService).toBeTruthy();
  });

});
