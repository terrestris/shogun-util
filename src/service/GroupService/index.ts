import GenericService, { GenericServiceOpts } from '../GenericService';

import Group, { ProviderGroupDetails, KeycloakGroupRepresentation } from '../../model/Group';

export class GroupService<T extends Group<S>,
  S extends ProviderGroupDetails = KeycloakGroupRepresentation> extends GenericService<T> {

  constructor(opts: GenericServiceOpts = {
    basePath: '/groups'
  }) {
    super(opts);
  }

}

export default GroupService;
