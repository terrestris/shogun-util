import Application, {
  ApplicationArgs,
  DefaultApplicationClientConfig
} from '../model/Application';

import ApplicationService from './ApplicationService';
import AuthService from './AuthService';
import GraphQLService from './GraphQLService';
import AppInfoService from './AppInfoService';
import LayerService from './LayerService';
import UserService from './UserService';
import GroupService from './GroupService';

import fetchSpy, { successResponse } from '../spec/fetchSpy';

import SHOGunClient from './SHOGunClient';
import CacheService from './CacheService';
import FileService from './FileService';
import ImageFileService from './ImageFileService';

export interface MyDefaultApplicationClientConfig extends DefaultApplicationClientConfig {
  newField: number;
}

export interface MyApplicationArgs extends ApplicationArgs {
  clientConfig: MyDefaultApplicationClientConfig;
}

export default class MyApplication extends Application {
  clientConfig?: MyDefaultApplicationClientConfig;

  constructor(args: MyApplicationArgs) {
    super(args);

    this.clientConfig = args.clientConfig;
  }
}

describe('SHOGunClient', () => {
  let fetchMock: jest.SpyInstance;
  let client: SHOGunClient;

  beforeEach(() => {
    client = new SHOGunClient({
      url: '/'
    });
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is defined', () => {
    expect(SHOGunClient).toBeDefined();
  });

  it('can be instantiated', async () => {
    expect(client).toBeDefined();
  });

  it('contains all expected services and parsers', async () => {
    expect(client.application() instanceof ApplicationService).toBeTruthy();
    expect(client.auth() instanceof AuthService).toBeTruthy();
    expect(client.graphql() instanceof GraphQLService).toBeTruthy();
    expect(client.info() instanceof AppInfoService).toBeTruthy();
    expect(client.layer() instanceof LayerService).toBeTruthy();
    expect(client.user() instanceof UserService).toBeTruthy();
    expect(client.group() instanceof GroupService).toBeTruthy();
    expect(client.cache() instanceof CacheService).toBeTruthy();
    expect(client.file() instanceof FileService).toBeTruthy();
    expect(client.imagefile() instanceof ImageFileService).toBeTruthy();
  });

  it('can be extended', async () => {
    const myApplication: MyApplicationArgs = {
      layerTree: {
        checked: false,
        children: [],
        layerId: 1909,
        title: ''
      },
      clientConfig: {
        newField: 1,
        description: 'My description',
        mapView: {}
      }
    };

    fetchMock = fetchSpy(successResponse([myApplication]));

    const apps = await client.application<MyApplication>().findAll();

    expect(apps[0].clientConfig?.newField).toEqual(1);
  });
});
