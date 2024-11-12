import Role, { KeycloakRoleRepresentation, ProviderRoleDetails } from '../../model/Role';
import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import GenericEntityService, { GenericEntityServiceOpts } from '../GenericEntityService';

export class RoleService<T extends Role<S>,
  S extends ProviderRoleDetails = KeycloakRoleRepresentation> extends GenericEntityService<T> {

  constructor(opts: GenericEntityServiceOpts = {
    basePath: '/roles'
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
      throw new Error(`Error while creating the roles from the role provider: ${error}`);
    }
  }
}

export default RoleService;
