import Keycloak from 'keycloak-js';

import { UrlUtil } from '@terrestris/base-util';

export interface PageSorter {
  properties: string[];
  order?: 'asc' | 'desc';
}

export interface PageOpts {
  page?: number;
  size?: number;
  sort?: PageSorter;
}

export interface GenericServiceOpts {
  basePath: string;
  keycloak?: Keycloak;
}

export abstract class GenericService {

  protected readonly basePath: string;
  protected readonly keycloak?: Keycloak;

  protected constructor(opts: GenericServiceOpts) {
    this.basePath = opts.basePath;
    this.keycloak = opts.keycloak;
  }

  protected getPageUrl(pageOpts?: PageOpts) {
    const opts: any = {};

    if (Number.isFinite(pageOpts?.page)) {
      opts.page = pageOpts?.page;
    }

    if (Number.isFinite(pageOpts?.size)) {
      opts.size = pageOpts?.size;
    }

    if (pageOpts?.sort) {
      const sortValue = [...pageOpts.sort.properties, pageOpts.sort.order].filter(a => a);
      if (sortValue.length > 0) {
        opts.sort = `${sortValue.join(',')}`;
      }
    }

    if (Object.keys(opts).length === 0) {
      return this.basePath;
    }

    return `${this.basePath}?${UrlUtil.objectToRequestString(opts)}`;
  }
}

export default GenericService;
