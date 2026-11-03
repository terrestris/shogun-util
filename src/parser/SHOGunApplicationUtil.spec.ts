import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlLayerImage from 'ol/layer/Image';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerVector from 'ol/layer/Vector';
import { bbox as olStrategyBbox } from 'ol/loadingstrategy';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlSourceVector from 'ol/source/Vector';
import OlSourceWMTS from 'ol/source/WMTS';
import OlTileGridWMTS from 'ol/tilegrid/WMTS';
import OlSourceXYZ from 'ol/source/XYZ';
import OlTileGrid from 'ol/tilegrid/TileGrid';
import OlCollection from 'ol/Collection';
import OlInteraction from 'ol/interaction/Interaction';
import OlDragPan from 'ol/interaction/DragPan';
import OlDoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import { getUid } from 'ol/util';
import { defaults as DefaultInteractions } from 'ol/interaction/defaults'
import Logger from '@terrestris/base-util/dist/Logger';

import Application, { DefaultLayerTree } from '../model/Application';
import Layer from '../model/Layer';
import SHOGunAPIClient from '../service/SHOGunAPIClient';
import SHOGunApplicationUtil from './SHOGunApplicationUtil';
import { omit } from 'lodash';

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

  describe('parseMapInteractions', () => {

    it('returns the default interactions if no interactions are configured', async () => {
      const defaultInteractions = DefaultInteractions();
      const interactions = await util.parseMapInteractions({}) as OlCollection<OlInteraction>;
      const interactionsArray = interactions.getArray();
      expect(interactions).toBeDefined();
      expect(interactionsArray).toHaveLength(defaultInteractions.getLength());

      interactionsArray.forEach((interaction, index) => {
        const got = omit(interaction, 'ol_uid');
        const tar = omit(defaultInteractions.item(index), 'ol_uid');
        expect(interaction).toBeInstanceOf(OlInteraction);
        expect(JSON.stringify(got)).toEqual(JSON.stringify(tar));
      });
    });

    it('returns the configured interactions if interactions are configured', async () => {
      const interactions = await util.parseMapInteractions({
        clientConfig: {
          mapView: {},
          mapInteractions: [
            'DragPan',
            'DoubleClickZoom'
          ]
        }
      }) as OlInteraction[];

      expect(interactions).toBeDefined();
      expect(interactions).toHaveLength(2);
      expect(interactions[0]).toBeInstanceOf(OlDragPan);
      expect(interactions[1]).toBeInstanceOf(OlDoubleClickZoom);
    });

    it('filters invalid interactions and logs a warning', async () => {
      const consoleError = jest.spyOn(Logger, 'warn').mockImplementation(() => {});
      const interactions = await util.parseMapInteractions({
        clientConfig: {
          mapView: {},
          mapInteractions: [
            'DragPan',
            // @ts-ignore
            'InvalidInteraction'
          ]
        }
      }) as OlInteraction[];

      expect(interactions).toBeDefined();
      expect(interactions).toHaveLength(1);
      expect(interactions[0]).toBeInstanceOf(OlDragPan);
      expect(consoleError).toHaveBeenCalled();
    });
  });

  describe('parseMvtLayer', () => {
    it('parses an MVT layer correctly', () => {
      const myLayer: Layer = {
        id: 1909,
        name: 'Layer A',
        type: 'MVT',
        sourceConfig: {
          url: 'https://example.com/mytileserver/mylayer/{z}/{x}/{y}.pbf',
          layerNames: ''
        }
      };

      const layer = util.parseMvtLayer(myLayer);
      expect(layer).toBeDefined();

      const source = layer.getSource()
      expect(source).toBeDefined();

      const urls = source?.getUrls();
      expect(urls).toBeDefined();
      expect(urls?.length).toBe(1);
      expect(urls![0]).toEqual(myLayer.sourceConfig.url);

      expect(layer.get('shogunId')).toBe(myLayer.id);
      expect(layer.get('name')).toBe(myLayer.name);
      expect(layer.get('type')).toBe(myLayer.type);
    });
  });

  describe('parseWMTSLayer', () => {
    const originalFetch = global.fetch;

    // This tile grid is based on the DE_EPSG_3857_ADV matrix set from the Basemap.de WMTS service.
    const tileGrid = {
      origins: Array(14).fill([-20037508.3427892, 20037508.3427892]),
      resolutions: [
        4891.979594210469,
        2445.9897971052346,
        1222.9948985526173,
        611.4974492763087,
        305.74872463815433,
        152.87436231907765,
        76.43718115953862,
        38.21859057976927,
        19.10929528988468,
        9.554647644942323,
        4.777323822471167,
        2.3886619112355834,
        1.1943309556177917,
        0.5971654778088948
      ],
      matrixIds: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'],
      matrixSizes: [
        [32, 32], [64, 64], [128, 128], [256, 256], [512, 512], [1024, 1024], [2048, 2048],
        [4096, 4096], [8192, 8192], [16384, 16384], [32768, 32768], [65536, 65536],
        [131072, 131072], [262144, 262144]
      ],
      tileSizes: Array(14).fill([256, 256])
    };

    const createWMTSLayer = (sourceConfigOverrides: Record<string, unknown> = {}): Layer => ({
      id: 42,
      name: 'WMTS Layer',
      type: 'WMTS',
      clientConfig: {
        crossOrigin: 'anonymous',
        opacity: 0.5
      },
      sourceConfig: {
        useBearerToken: false,
        format: 'image/png',
        matrixSet: 'DE_EPSG_3857_ADV',
        projection: 'EPSG:3857',
        requestEncoding: 'REST',
        tileGrid,
        urls: [
          'https://sgx.geodatenzentrum.de/wmts_basemapde/wmts/1.0.0/wmts/tile/1.0.0/de_basemapde_web_raster_farbe/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png'
        ],
        wmtsLayerName: 'de_basemapde_web_raster_farbe',
        wmtsStyle: 'default',
        ...sourceConfigOverrides
      }
    } as unknown as Layer);

    beforeEach(() => {
      global.fetch = jest.fn().mockRejectedValue(new Error('network disabled in tests'));
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('creates the layer from the config without fetching capabilities', async () => {
      const layer = await util.parseWMTSLayer(createWMTSLayer(), 'EPSG:3857', false);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(layer).toBeDefined();

      const source = layer!.getSource() as OlSourceWMTS;
      expect(source).toBeInstanceOf(OlSourceWMTS);
      expect(source.getLayer()).toBe('de_basemapde_web_raster_farbe');
      expect(source.getMatrixSet()).toBe('DE_EPSG_3857_ADV');
      expect(source.getStyle()).toBe('default');
      expect(source.getFormat()).toBe('image/png');
      expect(source.getRequestEncoding()).toBe('REST');
      expect(source.getUrls()).toEqual([
        'https://sgx.geodatenzentrum.de/wmts_basemapde/wmts/1.0.0/wmts/tile/1.0.0/de_basemapde_web_raster_farbe/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png'
      ]);
      expect(source.get('legendUrl')).toBe('');
      expect(source.get('matrixSizes')).toEqual(tileGrid.matrixSizes);
      expect(source.getTileGrid()?.getResolutions()).toEqual(tileGrid.resolutions);
      expect((source.getTileGrid() as OlTileGridWMTS).getMatrixIds()).toEqual(tileGrid.matrixIds);
      expect(layer!.getOpacity()).toBe(0.5);
    });

    it('passes the configured WMTS dimensions to the source', async () => {
      const layer = await util.parseWMTSLayer(
        createWMTSLayer({ wmtsDimensions: { time: '2026' } }),
        'EPSG:3857',
        false
      );

      expect((layer!.getSource() as OlSourceWMTS).getDimensions()).toEqual({ time: '2026' });
    });

    it('uses the configured tile sizes', async () => {
      const layer = await util.parseWMTSLayer(
        createWMTSLayer({ tileGrid: { ...tileGrid, tileSizes: Array(14).fill([512, 512]) } }),
        'EPSG:3857',
        false
      );

      const grid = (layer!.getSource() as OlSourceWMTS).getTileGrid();
      expect(grid?.getTileSize(0)).toEqual([512, 512]);
    });

    it('defaults the tile size to 256 for every resolution when none is configured', async () => {
      const { tileSizes, ...tileGridWithoutTileSizes } = tileGrid;
      const layer = await util.parseWMTSLayer(
        createWMTSLayer({ tileGrid: tileGridWithoutTileSizes }),
        'EPSG:3857',
        false
      );

      const grid = (layer!.getSource() as OlSourceWMTS).getTileGrid();
      expect(grid?.getTileSize(0)).toEqual([256, 256]);
      expect(grid?.getTileSize(13)).toEqual([256, 256]);
    });

    it('uses the projection from the config over the given one', async () => {
      const layer = await util.parseWMTSLayer(createWMTSLayer(), 'EPSG:4326', false);

      expect((layer!.getSource() as OlSourceWMTS).getProjection()?.getCode()).toBe('EPSG:3857');
    });

    it('falls back to the given projection when the config has none', async () => {
      const layer = await util.parseWMTSLayer(
        createWMTSLayer({ projection: undefined }),
        'EPSG:4326',
        false
      );

      expect((layer!.getSource() as OlSourceWMTS).getProjection()?.getCode()).toBe('EPSG:4326');
    });

    it.each([
      ['tileGrid is missing', { tileGrid: undefined }, 'incomplete tileGrid configuration'],
      ['matrixIds are missing', { tileGrid: { ...tileGrid, matrixIds: undefined } }, 'incomplete tileGrid configuration'],
      ['urls are missing', { urls: [] }, 'incomplete source configuration'],
      ['wmtsStyle is missing', { wmtsStyle: undefined }, 'incomplete source configuration']
    ])('returns undefined and logs an error when %s', async (_, overrides, expectedMessage) => {
      const loggerError = jest.spyOn(Logger, 'error').mockImplementation(() => {});

      const layer = await util.parseWMTSLayer(createWMTSLayer(overrides), 'EPSG:3857', false);

      expect(layer).toBeUndefined();
      expect(loggerError).toHaveBeenCalledWith(expect.stringContaining(expectedMessage));

      loggerError.mockRestore();
    });

    it('fetches the capabilities by default and returns undefined if this fails', async () => {
      const loggerError = jest.spyOn(Logger, 'error').mockImplementation(() => {});

      const layer = await util.parseWMTSLayer(createWMTSLayer());

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(layer).toBeUndefined();
      expect(loggerError).toHaveBeenCalledWith(expect.stringContaining('error while reading the WMTS GetCapabilities'));

      loggerError.mockRestore();
    });

    it('returns undefined and logs an error if the capabilities do not contain the layer', async () => {
      const loggerError = jest.spyOn(Logger, 'error').mockImplementation(() => {});
      global.fetch = jest.fn().mockResolvedValue({
        text: async () => '<Capabilities xmlns="http://www.opengis.net/wmts/1.0" version="1.0.0"><Contents/></Capabilities>'
      });

      const layer = await util.parseWMTSLayer(createWMTSLayer());

      expect(layer).toBeUndefined();
      expect(loggerError).toHaveBeenCalledWith('Could not get the options from the capabilities');

      loggerError.mockRestore();
    });
  });

});
