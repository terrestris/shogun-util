import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlLayerImage from 'ol/layer/Image';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerVector from 'ol/layer/Vector';
import { bbox as olStrategyBbox } from 'ol/loadingstrategy';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlSourceVector from 'ol/source/Vector';
import OlSourceXYZ from 'ol/source/XYZ';
import OlTileGrid from 'ol/tilegrid/TileGrid';
import { getUid } from 'ol/util';

import Application, { DefaultLayerTree } from '../model/Application';
import Layer from '../model/Layer';
import SHOGunAPIClient from '../service/SHOGunAPIClient';
import SHOGunApplicationUtil from './SHOGunApplicationUtil';

describe('SHOGunApplicationUtil', () => {
  let util: SHOGunApplicationUtil<Application, Layer>;

  beforeEach(() => {
    util = new SHOGunApplicationUtil<Application, Layer>({
      client: new SHOGunAPIClient()
    });
  });

  it('is defined', () => {
    expect(SHOGunApplicationUtil).toBeDefined();
  });

  it('creates a mapView', async () => {
    const myApplication: Application = {};

    const mapView = await util.parseMapView(myApplication);

    expect(mapView).toBeDefined();
  });

  it('parseLayerTree', async () => {
    const myApplication: Application = {
      layerTree: {
        title: 'ROOT',
        checked: true,
        layerId: 1909,
        children: [{
          title: 'Layer 1',
          checked: true,
          layerId: 1,
          children: []
        }]
      }
    };

    const layerTree = await util.parseLayerTree(myApplication);

    expect(layerTree).toBeDefined();
  });

  it('properly gathers IDs of configured layers in layertree (getLayerIds)', () => {

    const myLayerTree: DefaultLayerTree = {
      title: 'My Layer Tree',
      checked: true,
      layerId: 12345,
      children: [{
        title: 'Layer Folder 1',
        checked: false,
        layerId: 111,
        children: [
          {
            title: 'Layer 1',
            checked: false,
            layerId: 1,
            children: []
          },
          {
            title: 'Layer 2',
            checked: false,
            layerId: 2,
            children: []
          }
        ]
      }, {
        title: 'Layer Folder 2',
        checked: false,
        layerId: 222,
        children: [
          {
            title: 'Layer 3',
            layerId: 3,
            checked: false,
            children: []
          },
          {
            title: 'Layer 4',
            layerId: 4,
            checked: false,
            children: []
          }
        ]
      }, {
        title: 'Layer 5',
        layerId: 5,
        checked: true,
        children: []
      }]
    };
    const layerIds = util.getLayerIds(myLayerTree.children);
    const expectedIds = [1, 2, 3, 4, 5];
    expect(layerIds).toEqual(expect.arrayContaining(expectedIds));
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
          displayName: 'id'
        }],
        downloadConfig: [{
          downloadUrl: 'https://example.com/geo/ows?request=GetFeature&outputFormat=application%2Fjson',
          formatName: 'GeoJSON'
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
          LAYERS: myLayer.sourceConfig.layerNames,
          TRANSPARENT: true
        },
        crossOrigin: myLayer.clientConfig?.crossOrigin
      }),
      minResolution: myLayer.clientConfig?.minResolution,
      maxResolution: myLayer.clientConfig?.maxResolution
    });

    // @ts-ignore
    // eslint-disable-next-line camelcase
    expected.ol_uid = getUid(layer);
    // @ts-ignore
    // eslint-disable-next-line camelcase
    expected.getSource().ol_uid = getUid(layer.getSource());

    expected.set('shogunId', myLayer.id);
    expected.set('name', myLayer.name);
    expected.set('type', myLayer.type);
    expected.set('searchable', myLayer.clientConfig?.searchable);
    expected.set('propertyConfig', myLayer.clientConfig?.propertyConfig);
    expected.set('downloadConfig', myLayer.clientConfig?.downloadConfig);
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
        layerNames: 'OSM-WMS',
        tileSize: 512,
        tileOrigin: [0, 0],
        resolutions: [
          16,
          8,
          4,
          2,
          1
        ]
      }
    };

    const layer = await util.parseLayer(myLayer);

    const expected = new OlLayerTile({
      source: new OlSourceTileWMS({
        url: myLayer.sourceConfig.url,
        tileGrid: new OlTileGrid({
          resolutions: myLayer.sourceConfig.resolutions!,
          tileSize: [
            myLayer.sourceConfig.tileSize!,
            myLayer.sourceConfig.tileSize!
          ],
          origin: myLayer.sourceConfig.tileOrigin
        }),
        attributions: myLayer.sourceConfig.attribution,
        params: {
          LAYERS: myLayer.sourceConfig.layerNames,
          TRANSPARENT: true
        },
        crossOrigin: myLayer.clientConfig?.crossOrigin,
        projection: 'EPSG:3857'
      }),
      minResolution: myLayer.clientConfig?.minResolution,
      maxResolution: myLayer.clientConfig?.maxResolution
    });

    // @ts-ignore
    // eslint-disable-next-line camelcase
    expected.ol_uid = getUid(layer);
    // @ts-ignore
    // eslint-disable-next-line camelcase
    expected.getSource().ol_uid = getUid(layer.getSource());

    expected.set('shogunId', myLayer.id);
    expected.set('name', myLayer.name);
    expected.set('type', myLayer.type);
    expected.set('searchable', myLayer.clientConfig?.searchable);
    expected.set('propertyConfig', myLayer.clientConfig?.propertyConfig);
    expected.set('legendUrl', myLayer.sourceConfig.legendUrl);
    expected.set('hoverable', myLayer.clientConfig?.hoverable);

    expect(JSON.stringify(layer)).toEqual(JSON.stringify(expected));
  });

  it('is capable to parse a WFS layer (parseWFSLayer)', async () => {
    const myLayer: Layer = {
      id: 1909,
      created: new Date(),
      modified: new Date(),
      name: 'Layer A',
      type: 'WFS',
      clientConfig: {},
      sourceConfig: {
        url: 'https://ows.terrestris.de/osm/service?',
        layerNames: 'OSM-WMS'
      }
    };

    const layer = await util.parseLayer(myLayer);

    const expected = new OlLayerVector({
      source: new OlSourceVector({
        format: new OlFormatGeoJSON(),
        attributions: myLayer.sourceConfig.attribution,
        strategy: olStrategyBbox,
        url: () => {
          return '';
        }
      }),
      minResolution: myLayer.clientConfig?.minResolution,
      maxResolution: myLayer.clientConfig?.maxResolution
    });

    expected.set('shogunId', myLayer.id);
    expected.set('name', myLayer.name);
    expected.set('type', myLayer.type);
    expected.set('searchable', myLayer.clientConfig?.searchable);
    expected.set('propertyConfig', myLayer.clientConfig?.propertyConfig);
    expected.set('legendUrl', myLayer.sourceConfig.legendUrl);
    expected.set('hoverable', myLayer.clientConfig?.hoverable);

    // @ts-ignore
    // eslint-disable-next-line camelcase
    expected.ol_uid = getUid(layer);
    // @ts-ignore
    // eslint-disable-next-line camelcase
    expected.getSource().ol_uid = getUid(layer.getSource());

    expect(JSON.stringify(layer)).toEqual(JSON.stringify(expected));
  });

  it('is capable to parse a XYZ layer (parseXYZLayer)', async () => {
    const myLayer: Layer = {
      id: 1909,
      created: new Date(),
      modified: new Date(),
      name: 'Layer A',
      type: 'XYZ',
      clientConfig: {},
      sourceConfig: {
        url: 'https://ows.terrestris.de/osm/service/{z}/{x}/{y}.png',
        layerNames: ''
      }
    };

    const layer = await util.parseLayer(myLayer);

    const expected = new OlLayerTile({
      source: new OlSourceXYZ({
        attributions: myLayer.sourceConfig.attribution,
        url: myLayer.sourceConfig.url
      }),
      minResolution: myLayer.clientConfig?.minResolution,
      maxResolution: myLayer.clientConfig?.maxResolution
    });

    expected.set('shogunId', myLayer.id);
    expected.set('name', myLayer.name);
    expected.set('type', myLayer.type);
    expected.set('searchable', myLayer.clientConfig?.searchable);
    expected.set('propertyConfig', myLayer.clientConfig?.propertyConfig);
    expected.set('legendUrl', myLayer.sourceConfig.legendUrl);
    expected.set('hoverable', myLayer.clientConfig?.hoverable);

    // @ts-ignore
    // eslint-disable-next-line camelcase
    expected.ol_uid = getUid(layer);
    // @ts-ignore
    // eslint-disable-next-line camelcase
    expected.getSource().ol_uid = getUid(layer.getSource());

    expect(JSON.stringify(layer)).toEqual(JSON.stringify(expected));
  });

});
