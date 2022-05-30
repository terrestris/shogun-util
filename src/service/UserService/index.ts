import GenericService, { GenericServiceOpts } from '../GenericService';

import User, { KeycloakUserRepresentation, ProviderUserDetails } from '../../model/User';

export class UserService<T extends User<S>, S extends ProviderUserDetails = KeycloakUserRepresentation> extends GenericService<T> {

  constructor(opts: GenericServiceOpts = {
    basePath: '/users'
  }) {
    super(opts);
  }

}

export default UserService;
