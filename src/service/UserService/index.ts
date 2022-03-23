import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';

import GenericService, { GenericServiceOpts } from '../GenericService';

import User from '../../model/User';

export class UserService extends GenericService<User> {

  constructor(opts: GenericServiceOpts = {
    basePath: '/users'
  }) {
    super(User, opts);
  }

  async logout(url: string = '/sso/logout', requestOpts: RequestInit = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie()
    }
  }): Promise<void> {
    try {
      const response = await fetch(url, requestOpts);

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      if (response.url) {
        window.location.href = response.url;
      } else {
        window.location.reload();
      }
    } catch (error) {
      throw new Error(`Error while logging out: ${error}`);
    }
  }

}

export default UserService;
