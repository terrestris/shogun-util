import { getCsrfTokenHeader } from '../../getCsrfTokenHeader';

import { AppInfo } from '../../model/AppInfo';

export interface AppInfoServiceOpts {
  url: string;
};

export class AppInfoService {
  private path: string;

  constructor(opts: AppInfoServiceOpts = {
    url: '/info/app'
  }) {
    this.path = opts.url;
  }

  async getAppInfo(fetchOpts?: RequestInit): Promise<AppInfo> {
    try {
      const response = await fetch(this.path, {
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
