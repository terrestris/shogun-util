import Keycloak from 'keycloak-js';

import Application from '../model/Application';
import File from '../model/File';
import Group, { ProviderGroupDetails } from '../model/Group';
import ImageFile from '../model/ImageFile';
import Layer from '../model/Layer';
import Role, { ProviderRoleDetails } from '../model/Role';
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
import OpenAPIService from './OpenAPIService';
import RoleService from './RoleService';
import UserService from './UserService';

export interface SHOGunAPIClientOpts {
  /**
   * The URL to the SHOGun instance, e.g. '/api'. The default is to '/'.
   */
  url: string;

  /**
   * The keycloak instance.
   */
  keycloak?: Keycloak;
}

export class SHOGunAPIClient {

  private basePath: string;
  private keycloak?: Keycloak;

  private cacheService?: CacheService;
  private appInfoService?: AppInfoService;
  private applicationService?: ApplicationService<any>;
  private layerService?: LayerService<any>;
  private groupService?: GroupService<any>;
  private userService?: UserService<any>;
  private roleService?: RoleService<any>;
  private fileService?: FileService<any>;
  private imageFileService?: ImageFileService<any>;
  private authService?: AuthService;
  private graphqlService?: GraphQLService;
  private openapiService?: OpenAPIService;

  constructor(opts: SHOGunAPIClientOpts = {
    url: '/'
  }) {
    this.basePath = opts.url;
    this.keycloak = opts.keycloak;
  }

  cache(): CacheService {
    if (!this.cacheService) {
      this.cacheService = new CacheService({
        basePath: `${this.basePath}cache`,
        keycloak: this.keycloak
      });
    }

    return this.cacheService;
  }

  info(): AppInfoService {
    if (!this.appInfoService) {
      this.appInfoService = new AppInfoService({
        basePath: `${this.basePath}info`,
        keycloak: this.keycloak
      });
    }

    return this.appInfoService;
  }

  application<T extends Application>(): ApplicationService<T> {
    if (!this.applicationService) {
      this.applicationService = new ApplicationService<T>({
        basePath: `${this.basePath}applications`,
        keycloak: this.keycloak
      });
    }

    return this.applicationService;
  }

  layer<T extends Layer>(): LayerService<T> {
    if (!this.layerService) {
      this.layerService = new LayerService<T>({
        basePath: `${this.basePath}layers`,
        keycloak: this.keycloak
      });
    }

    return this.layerService;
  }

  group<T extends Group<S>, S extends ProviderGroupDetails>(): GroupService<T, S> {
    if (!this.groupService) {
      this.groupService = new GroupService<T, S>({
        basePath: `${this.basePath}groups`,
        keycloak: this.keycloak
      });
    }

    return this.groupService;
  }

  user<T extends User<S>, S extends ProviderUserDetails>(): UserService<T, S> {
    if (!this.userService) {
      this.userService = new UserService<T, S>({
        basePath: `${this.basePath}users`,
        keycloak: this.keycloak
      });
    }

    return this.userService;
  }

  role<T extends Role<S>, S extends ProviderRoleDetails>(): RoleService<T, S> {
    if (!this.roleService) {
      this.roleService = new RoleService<T, S>({
        basePath: `${this.basePath}roles`,
        keycloak: this.keycloak
      });
    }

    return this.roleService;
  }

  file<T extends File>(): FileService<T> {
    if (!this.fileService) {
      this.fileService = new FileService<T>({
        basePath: `${this.basePath}files`,
        keycloak: this.keycloak
      });
    }

    return this.fileService;
  }

  imagefile<T extends ImageFile>(): ImageFileService<T> {
    if (!this.imageFileService) {
      this.imageFileService = new ImageFileService<T>({
        basePath: `${this.basePath}imagefiles`,
        keycloak: this.keycloak
      });
    }

    return this.imageFileService;
  }

  auth(): AuthService {
    if (!this.authService) {
      this.authService = new AuthService({
        basePath: `${this.basePath}sso`,
        keycloak: this.keycloak
      });
    }

    return this.authService;
  }

  graphql(): GraphQLService {
    if (!this.graphqlService) {
      this.graphqlService = new GraphQLService({
        basePath: `${this.basePath}graphql`,
        keycloak: this.keycloak
      });
    }

    return this.graphqlService;
  }

  openapi(): OpenAPIService {
    if (!this.openapiService) {
      this.openapiService = new OpenAPIService({
        basePath: `${this.basePath}`,
        keycloak: this.keycloak
      });
    }

    return this.openapiService;
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

export default SHOGunAPIClient;
