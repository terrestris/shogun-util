import User, { KeycloakUserRepresentation, ProviderUserDetails } from '../../model/User';
import GenericService, { GenericServiceOpts } from '../GenericService';

export class UserService<T extends User<S>,
  S extends ProviderUserDetails = KeycloakUserRepresentation> extends GenericService<T> {

  constructor(opts: GenericServiceOpts = {
    basePath: '/users'
  }) {
    super(opts);
  }

}

export default UserService;
