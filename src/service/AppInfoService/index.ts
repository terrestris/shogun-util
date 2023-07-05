import { AppInfo } from '../../model/AppInfo';
import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import { GenericService, GenericServiceOpts } from '../GenericService';

export type AppInfoServiceOpts = GenericServiceOpts;

export class AppInfoService extends GenericService {

  constructor(opts: AppInfoServiceOpts = {
    basePath: '/info'
  }) {
    super(opts);
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

      return await response.json();
    } catch (error) {
      throw new Error(`Error while requesting the application info: ${error}`);
    }
  }

}

export default AppInfoService;
