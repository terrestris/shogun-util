import User, { KeycloakUserRepresentation, ProviderUserDetails } from '../../model/User';
import GenericEntityService, { GenericEntityServiceOpts } from '../GenericEntityService';

export class UserService<T extends User<S>,
  S extends ProviderUserDetails = KeycloakUserRepresentation> extends GenericEntityService<T> {

  constructor(opts: GenericEntityServiceOpts = {
    basePath: '/users'
  }) {
    super(opts);
  }

}

export default UserService;
