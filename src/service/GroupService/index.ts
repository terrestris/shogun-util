import Group, { KeycloakGroupRepresentation,ProviderGroupDetails } from '../../model/Group';
import GenericEntityService, { GenericEntityServiceOpts } from '../GenericEntityService';

export class GroupService<T extends Group<S>,
  S extends ProviderGroupDetails = KeycloakGroupRepresentation> extends GenericEntityService<T> {

  constructor(opts: GenericEntityServiceOpts = {
    basePath: '/groups'
  }) {
    super(opts);
  }

}

export default GroupService;
