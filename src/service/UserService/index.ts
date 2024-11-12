import User, { KeycloakUserRepresentation, ProviderUserDetails } from '../../model/User';
import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import GenericEntityService, { GenericEntityServiceOpts } from '../GenericEntityService';

export class UserService<T extends User<S>,
  S extends ProviderUserDetails = KeycloakUserRepresentation> extends GenericEntityService<T> {

  constructor(opts: GenericEntityServiceOpts = {
    basePath: '/users'
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
      throw new Error(`Error while creating the users from the user provider: ${error}`);
    }
  }
}

export default UserService;
