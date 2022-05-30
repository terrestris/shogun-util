import { getCsrfTokenHeader } from '../../security/getCsrfTokenHeader';

import { AppInfo } from '../../model/AppInfo';

export interface AppInfoServiceOpts {
  basePath: string;
};

export class AppInfoService {
  private basePath: string;

  constructor(opts: AppInfoServiceOpts = {
    basePath: '/info'
  }) {
    this.basePath = opts.basePath;
  }

  async getAppInfo(fetchOpts?: RequestInit): Promise<AppInfo> {
    try {
      const response = await fetch(`${this.basePath}/app`, {
        method: 'GET',
        headers: {
          ...getCsrfTokenHeader()
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
