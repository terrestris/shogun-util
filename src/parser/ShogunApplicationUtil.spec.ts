import OlView, { ViewOptions } from 'ol/View';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceWMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import OlLayerImage from 'ol/layer/Image';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlTileGrid from 'ol/tilegrid/TileGrid';

import Application from '../model/Application';
import Layer from '../model/Layer';
import fetchSpy, {
  failureResponse,
  successResponse
} from '../spec/fetchSpy';

import ShogunApplicationUtil from './ShogunApplicationUtil';

describe('AuthService', () => {
  let fetchMock: jest.SpyInstance;
  let util: ShogunApplicationUtil<Application, Layer>;

  beforeEach(() => {
    util = new ShogunApplicationUtil<Application, Layer>();
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockReset();
      fetchMock.mockRestore();
    }
  });

  it('is is defined', () => {
    expect(ShogunApplicationUtil).toBeDefined();
  });

  it('creates a mapView', async () => {
    const myApplication: Application = {};

    const mapView = await util.parseMapView(myApplication);

    expect(mapView).toBeDefined();
  });

  it('parseLayerTree', async () => {
    const myApplication: Application = {
      layerTree: {
        checked: true,
        layerId: 1909,
        title: 'ROOT',
        children: []
      }
    };

    const mapView = await util.parseLayerTree(myApplication);

    expect(mapView).toBeDefined();
  });

  it('is capable to parse a WMS layer (parseImageLayer)', async () => {
    const myLayer: Layer = {
      id: 1909,
      created: new Date(),
      modified: new Date(),
      name: 'Layer A',
      type: 'WMS',
      clientConfig: {
        crossOrigin: 'anonymous',
        hoverable: true,
        maxResolution: 1909,
        minResolution: 1909,
        propertyConfig: [{
          propertyName: 'ID',
          displayName: 'id',
          visible: true
        }],
        searchable: true
      },
      sourceConfig: {
        legendUrl: 'https://ows.terrestris.de/osm/legend?',
        resolutions: [],
        attribution: 'Copyright ',
        url: 'https://ows.terrestris.de/osm/service?',
        layerNames: 'OSM-WMS'
      }
    };

    const layer = await util.parseLayer(myLayer);

    const expected = new OlLayerImage({
      source: new OlSourceImageWMS({
        url: myLayer.sourceConfig.url,
        attributions: myLayer.sourceConfig.attribution,
        params: {
          'LAYERS': myLayer.sourceConfig.layerNames,
          'TRANSPARENT': true
        },
        crossOrigin: myLayer.clientConfig?.crossOrigin
      }),
      minResolution: myLayer.clientConfig?.minResolution,
      maxResolution: myLayer.clientConfig?.maxResolution
    });

    // expected.ol_uid = expect.any(String);
    // expected.getSource().ol_uid = expect.any(String);

    // @ts-ignore
    // eslint-disable-next-line camelcase
    expected.ol_uid = layer.ol_uid;
    // @ts-ignore
    // eslint-disable-next-line camelcase
    expected.getSource().ol_uid = layer.getSource().ol_uid;

    expected.set('shogunId', myLayer.id);
    expected.set('name', myLayer.name);
    expected.set('type', myLayer.type);
    expected.set('searchable', myLayer.clientConfig?.searchable);
    expected.set('propertyConfig', myLayer.clientConfig?.propertyConfig);
    expected.set('legendUrl', myLayer.sourceConfig.legendUrl);
    expected.set('hoverable', myLayer.clientConfig?.hoverable);

    expect(JSON.stringify(layer)).toEqual(JSON.stringify(expected));
  });

  it('is capable to parse a TILEWMS layer (parseTileLayer)', async () => {
    const myLayer: Layer = {
      id: 1909,
      created: new Date(),
      modified: new Date(),
      name: 'Layer A',
      type: 'TILEWMS',
      clientConfig: {},
      sourceConfig: {
        url: 'https://ows.terrestris.de/osm/service?',
        layerNames: 'OSM-WMS'
      }
    };

    const mapView = await util.parseLayer(myLayer);

    expect(mapView).toBeDefined();
  });

});
