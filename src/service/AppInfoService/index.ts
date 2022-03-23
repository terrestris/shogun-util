import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';

import { AppInfo } from '../../model/AppInfo';

export interface AppInfoServiceOpts {
  url: string;
};

export class AppInfoService {
  path: string;

  constructor(opts: AppInfoServiceOpts = {
    url: '/info/app'
  }) {
    this.path = opts.url;
  }

  async getAppInfo(requestOpts: RequestInit = {
    method: 'GET',
    headers: {
      'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie()
    }
  }): Promise<AppInfo> {
    try {
      const response = await fetch(this.path, requestOpts);

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
