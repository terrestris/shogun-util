import Application from '../model/Application';
import Layer from '../model/Layer';
import User from '../model/User';

import AppInfoService from './AppInfoService';
import ApplicationService from './ApplicationService';
import AuthService from './AuthService';
import CacheService from './CacheService';
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

  cache() {
    return new CacheService({
      basePath: `${this.basePath}cache`
    });
  }

  info() {
    return new AppInfoService({
      basePath: `${this.basePath}info`
    });
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
    return new AuthService({
      basePath: `${this.basePath}sso`
    });
  }

  graphql() {
    return new GraphQLService({
      basePath: `${this.basePath}graphql`
    });
  }

}

export default SHOGunClient;
