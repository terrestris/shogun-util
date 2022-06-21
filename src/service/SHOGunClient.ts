import Keycloak from 'keycloak-js';

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

  /**
   * The keycloak instance.
   */
  keycloak?: Keycloak;
}

export class SHOGunClient {

  private basePath: string;

  private keycloak?: Keycloak;

  constructor(opts: SHOGunClientOpts = {
    url: '/'
  }) {
    this.basePath = opts.url;
    this.keycloak = opts.keycloak;
  }

  cache() {
    return new CacheService({
      basePath: `${this.basePath}cache`,
      keycloak: this.keycloak
    });
  }

  info() {
    return new AppInfoService({
      basePath: `${this.basePath}info`,
      keycloak: this.keycloak
    });
  }

  application<T extends Application>() {
    return new ApplicationService<T>({
      basePath: `${this.basePath}applications`,
      keycloak: this.keycloak
    });
  }

  layer<T extends Layer>() {
    return new LayerService<T>({
      basePath: `${this.basePath}layers`,
      keycloak: this.keycloak
    });
  }

  group<T extends Group<S>, S extends ProviderGroupDetails>() {
    return new GroupService<T, S>({
      basePath: `${this.basePath}groups`,
      keycloak: this.keycloak
    });
  }

  user<T extends User<S>, S extends ProviderUserDetails>() {
    return new UserService<T, S>({
      basePath: `${this.basePath}users`,
      keycloak: this.keycloak
    });
  }

  file<T extends File>() {
    return new FileService<T>({
      basePath: `${this.basePath}files`,
      keycloak: this.keycloak
    });
  }

  imagefile<T extends ImageFile>() {
    return new ImageFileService<T>({
      basePath: `${this.basePath}imagefiles`,
      keycloak: this.keycloak
    });
  }

  auth() {
    return new AuthService({
      basePath: `${this.basePath}sso`,
      keycloak: this.keycloak
    });
  }

  graphql() {
    return new GraphQLService({
      basePath: `${this.basePath}graphql`,
      keycloak: this.keycloak
    });
  }

  getBasePath() {
    return this.basePath;
  }

  setBasePath(basePath: string) {
    this.basePath = basePath;
  }

  getKeycloak() {
    return this.keycloak;
  }

  setKeycloak(keycloak: Keycloak) {
    this.keycloak = keycloak;
  }
}

export default SHOGunClient;
