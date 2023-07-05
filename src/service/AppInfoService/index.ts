import Keycloak from 'keycloak-js';

import { AppInfo } from '../../model/AppInfo';
import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';

export interface AppInfoServiceOpts {
  basePath: string;
  keycloak?: Keycloak;
}

export class AppInfoService {

  private basePath: string;

  private keycloak?: Keycloak;

  constructor(opts: AppInfoServiceOpts = {
    basePath: '/info'
  }) {
    this.basePath = opts.basePath;
    this.keycloak = opts.keycloak;
  }

  async getAppInfo(fetchOpts?: RequestInit): Promise<AppInfo> {
    try {
      const response = await fetch(`${this.basePath}/app`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const json = await response.json();

      return json;
    } catch (error) {
      throw new Error(`Error while requesting the application info: ${error}`);
    }
  }

}

export default AppInfoService;
