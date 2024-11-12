import Group, { KeycloakGroupRepresentation,ProviderGroupDetails } from '../../model/Group';
import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import GenericEntityService, { GenericEntityServiceOpts } from '../GenericEntityService';

export class GroupService<T extends Group<S>,
  S extends ProviderGroupDetails = KeycloakGroupRepresentation> extends GenericEntityService<T> {

  constructor(opts: GenericEntityServiceOpts = {
    basePath: '/groups'
  }) {
    super(opts);
  }

  async createAllFromProvider(fetchOpts?: RequestInit) {
    try {
      const response = await fetch(`${this.basePath}/createAllFromProvider`, {
        method: 'POST',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error while creating the groups from the group provider: ${error}`);
    }
  }
}

export default GroupService;
