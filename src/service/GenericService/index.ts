import Keycloak from 'keycloak-js';

export type GenericServiceOpts = {
  basePath: string;
  keycloak?: Keycloak;
};

export abstract class GenericService {

  protected readonly basePath: string;
  protected readonly keycloak?: Keycloak;

  protected constructor(opts: GenericServiceOpts) {
    this.basePath = opts.basePath;
    this.keycloak = opts.keycloak;
  }

}

export default GenericService;
