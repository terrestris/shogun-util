import GroupService from '.';
import Group, { KeycloakGroupRepresentation } from '../../model/Group';
import GenericService from '../GenericService';

describe('GroupService', () => {
  let service: GroupService<Group<KeycloakGroupRepresentation>, KeycloakGroupRepresentation>;

  beforeEach(() => {
    service = new GroupService<Group<KeycloakGroupRepresentation>, KeycloakGroupRepresentation>();
  });

  it('is is defined', () => {
    expect(GroupService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericService).toBeTruthy();
  });

});
