import Role, { KeycloakRoleRepresentation, ProviderRoleDetails } from '../../model/Role';
import GenericEntityService, { GenericEntityServiceOpts } from '../GenericEntityService';

export class RoleService<T extends Role<S>,
  S extends ProviderRoleDetails = KeycloakRoleRepresentation> extends GenericEntityService<T> {

  constructor(opts: GenericEntityServiceOpts = {
    basePath: '/roles'
  }) {
    super(opts);
  }

}

export default RoleService;
