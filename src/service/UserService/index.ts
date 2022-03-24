import GenericService, { GenericServiceOpts } from '../GenericService';

import User from '../../model/User';
import { getCsrfTokenHeader } from '../../getCsrfTokenHeader';

export class UserService<T extends User> extends GenericService<T> {

  constructor(opts: GenericServiceOpts = {
    basePath: '/users'
  }) {
    super(opts);
  }

}

export default UserService;
