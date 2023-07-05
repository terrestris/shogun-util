import Group, { KeycloakGroupRepresentation } from '../../model/Group';
import GenericService from '../GenericService';
import GroupService from '.';

describe('GroupService', () => {
  let service: GroupService<Group<KeycloakGroupRepresentation>, KeycloakGroupRepresentation>;

  beforeEach(() => {
    service = new GroupService<Group<KeycloakGroupRepresentation>, KeycloakGroupRepresentation>();
  });

  it('is defined', () => {
    expect(GroupService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericService).toBeTruthy();
  });

  it('has set the correct default path', () => {
    expect(service.basePath).toEqual('/groups');
  });

});
