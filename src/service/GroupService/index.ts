import Group, { KeycloakGroupRepresentation,ProviderGroupDetails } from '../../model/Group';
import GenericService, { GenericServiceOpts } from '../GenericService';

export class GroupService<T extends Group<S>,
  S extends ProviderGroupDetails = KeycloakGroupRepresentation> extends GenericService<T> {

  constructor(opts: GenericServiceOpts = {
    basePath: '/groups'
  }) {
    super(opts);
  }

}

export default GroupService;
