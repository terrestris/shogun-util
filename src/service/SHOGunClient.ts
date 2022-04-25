import Application from '../model/Application';
import Layer from '../model/Layer';
import User from '../model/User';

import AppInfoService from './AppInfoService';
import ApplicationService from './ApplicationService';
import AuthService from './AuthService';
import GraphQLService from './GraphQLService';
import LayerService from './LayerService';
import UserService from './UserService';

export interface SHOGunClientOpts {
  /**
   * The URL to the SHOGun instance, e.g. '/api'. The default is to '/'.
   */
  url: string;
}

export class SHOGunClient {

  private basePath: string;

  constructor(opts: SHOGunClientOpts = {
    url: '/'
  }) {
    this.basePath = opts.url;
  }

  info() {
    return new AppInfoService();
  }

  application<T extends Application>() {
    return new ApplicationService<T>({
      basePath: `${this.basePath}applications`
    });
  }

  layer<T extends Layer>() {
    return new LayerService<T>({
      basePath: `${this.basePath}layers`
    });
  }

  user<T extends User>() {
    return new UserService<T>({
      basePath: `${this.basePath}users`
    });
  }

  auth() {
    return new AuthService();
  }

  graphql() {
    return new GraphQLService();
  }

}

export default SHOGunClient;
