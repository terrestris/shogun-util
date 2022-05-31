import Application from '../model/Application';
import File from '../model/File';
import Group, { ProviderGroupDetails } from '../model/Group';
import ImageFile from '../model/ImageFile';
import Layer from '../model/Layer';
import User, { ProviderUserDetails } from '../model/User';

import AppInfoService from './AppInfoService';
import ApplicationService from './ApplicationService';
import AuthService from './AuthService';
import CacheService from './CacheService';
import FileService from './FileService';
import GraphQLService from './GraphQLService';
import GroupService from './GroupService';
import ImageFileService from './ImageFileService';
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

  group<T extends Group<S>, S extends ProviderGroupDetails>() {
    return new GroupService<T, S>({
      basePath: `${this.basePath}groups`
    });
  }

  user<T extends User<S>, S extends ProviderUserDetails>() {
    return new UserService<T, S>({
      basePath: `${this.basePath}users`
    });
  }

  file<T extends File>() {
    return new FileService<T>({
      basePath: `${this.basePath}files`
    });
  }

  imagefile<T extends ImageFile>() {
    return new ImageFileService<T>({
      basePath: `${this.basePath}imagefiles`
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
