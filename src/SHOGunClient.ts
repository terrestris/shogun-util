import Application from './model/Application';
import Layer from './model/Layer';
import User from './model/User';

import ShogunApplicationUtil from './parser/ShogunApplicationUtil';

import AppInfoService from './service/AppInfoService';
import ApplicationService from './service/ApplicationService';
import AuthService from './service/AuthService';
import GraphQLService from './service/GraphQLService';
import LayerService from './service/LayerService';
import UserService from './service/UserService';

export interface SHOGunClientOpts {
  url: string;
}

export class SHOGunClient {

  private basePath: string;

  constructor(opts: SHOGunClientOpts) {
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

  parse() {
    return new ShogunApplicationUtil();
  }

  graphql() {
    return new GraphQLService();
  }

}

export default SHOGunClient;
