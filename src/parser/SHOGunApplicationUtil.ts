import _isNil from 'lodash/isNil';
import _uniqueBy from 'lodash/uniqBy';
import OlCollection from 'ol/Collection';
import { Extent as OlExtent } from 'ol/extent';
import OlFeature from 'ol/Feature';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlFormatMVT from 'ol/format/MVT';
import OlWMTSCapabilities from 'ol/format/WMTSCapabilities';
import OlGeometry from 'ol/geom/Geometry';
import OlImage from 'ol/Image';
import OlImageTile from 'ol/ImageTile';
import OlDblClickDragZoom from 'ol/interaction/DblClickDragZoom.js';
import { defaults as DefaultInteractions } from 'ol/interaction/defaults';
import OlDoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import OlDragPan from 'ol/interaction/DragPan';
import OlDragRotate from 'ol/interaction/DragRotate';
import OlDragRotateAndZoom from 'ol/interaction/DragRotateAndZoom';
import OlDragZoom from 'ol/interaction/DragZoom';
import OlInteraction from 'ol/interaction/Interaction';
import OlKeyboardPan from 'ol/interaction/KeyboardPan';
import OlKeyboardZoom from 'ol/interaction/KeyboardZoom';
import OlMouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import OlPinchRotate from 'ol/interaction/PinchRotate';
import OlPinchZoom from 'ol/interaction/PinchZoom';

import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlImageLayer from 'ol/layer/Image';
import OlTileLayer from 'ol/layer/Tile';
import OlLayerVector from 'ol/layer/Vector';
import OlVectorTileLayer from 'ol/layer/VectorTile';

import { bbox as olStrategyBbox } from 'ol/loadingstrategy';
import {
  fromLonLat,
  Projection as OlProjection,
  ProjectionLike as OlProjectionLike,
  get as getProjObject
} from 'ol/proj';
import { Units } from 'ol/proj/Units';
import OlImageWMS, { Options as OlImageWMSOptions } from 'ol/source/ImageWMS';
import OlTileWMS, { Options as OlTileWMSOptions } from 'ol/source/TileWMS';
import OlSourceVector from 'ol/source/Vector';
import OlSourceVectorTile from 'ol/source/VectorTile';
import OlSourceWMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import OlSourceXYZ, { Options as OlSourceXYZOptions } from 'ol/source/XYZ';
import OlTile from 'ol/Tile';
import OlTileGrid from 'ol/tilegrid/TileGrid';
import OlTileGridWMTS from 'ol/tilegrid/WMTS';
import OlTileState from 'ol/TileState';
import OlView, { ViewOptions as OlViewOptions } from 'ol/View';

import { apply as applyMapboxStyle } from 'ol-mapbox-style';

import Logger from '@terrestris/base-util/dist/Logger';
import { UrlUtil } from '@terrestris/base-util/dist/UrlUtil/UrlUtil';
import CapabilitiesUtil from '@terrestris/ol-util/dist/CapabilitiesUtil/CapabilitiesUtil';
import { MapUtil } from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import { defaultProj4CrsDefinitions, ProjectionUtil } from '@terrestris/ol-util/dist/ProjectionUtil/ProjectionUtil';

import { allLayersByIds } from '../graphqlqueries/Layers';
import Application, { DefaultLayerTree, MapInteraction } from '../model/Application';
import Layer from '../model/Layer';
import { getBearerTokenHeader } from '../security/getBearerTokenHeader';
import SHOGunAPIClient from '../service/SHOGunAPIClient';

export interface SHOGunApplicationUtilOpts {
  client?: SHOGunAPIClient;
}

class SHOGunApplicationUtil<
  T extends Application,
  S extends Layer
> {

  private readonly client: SHOGunAPIClient | undefined;

  constructor(opts?: SHOGunApplicationUtilOpts) {
    // TODO Default client?
    this.client = opts?.client;
  }

  async parseMapView(application: T, additionalOpts?: OlViewOptions): Promise<OlView> {

    const customProj4Definitions = application.clientConfig?.mapView?.crsDefinitions || [];

    const proj4Definitions = [
      ...customProj4Definitions,
      ...defaultProj4CrsDefinitions
    ];

    ProjectionUtil.initProj4Definitions(_uniqueBy(proj4Definitions, 'crsCode'), false);

    const mapView = application.clientConfig?.mapView;

    const projection = mapView?.projection || 'EPSG:3857';
    const zoom = mapView?.zoom || 0;
    const resolutions = mapView?.resolutions;

    let center;
    if (mapView?.center && mapView.center.length === 2) {
      center = fromLonLat([mapView.center[0], mapView.center[1]], projection);
    }

    let extent;
    if (mapView?.extent && mapView.extent.length === 4) {
      const ll = fromLonLat([mapView.extent[0], mapView.extent[1]], projection);
      const ur = fromLonLat([mapView.extent[2], mapView.extent[3]], projection);
      extent = [
        ll[0],
        ll[1],
        ur[0],
        ur[1]
      ];
    }

    return new OlView({
      projection,
      center,
      zoom,
      extent,
      resolutions,
      ...additionalOpts
    });
  }

  async parseLayerTree(application: T, projection?: OlProjectionLike, keepClientConfig = false) {
    const layers = await this.fetchLayers(application);
    if (layers) {
      return this.parseLayerTreeNodes(application, layers, projection, keepClientConfig);
    }
  }

  async parseLayerTreeNodes(application: T, layers: S[], projection?: OlProjectionLike, keepClientConfig = false) {
    const layerTree = application.layerTree;

    if (layerTree) {
      try {
        this.mergeApplicationLayerConfigs(layers, application);

        if (layerTree.children) {
          const nodes = await this.parseNodes(layerTree.children, layers, projection, keepClientConfig);

          return new OlLayerGroup({
            layers: nodes.reverse()
          });
        }
      } catch (e) {
        Logger.warn('Could not parse the layer tree: ', e);
        return new OlLayerGroup();
      }
    }
    return new OlLayerGroup();
  }

  async parseMapInteractions(application: T): Promise<OlInteraction[] | OlCollection<OlInteraction>> {
    const interactions = application.clientConfig?.mapInteractions;

    if (!interactions) {
      return DefaultInteractions();
    }

    const classMap: Record<MapInteraction, any> = {
      DragRotate: OlDragRotate,
      DragRotateAndZoom: OlDragRotateAndZoom,
      DblClickDragZoom: OlDblClickDragZoom,
      DoubleClickZoom: OlDoubleClickZoom,
      DragPan: OlDragPan,
      PinchRotate: OlPinchRotate,
      PinchZoom: OlPinchZoom,
      KeyboardPan: OlKeyboardPan,
      KeyboardZoom: OlKeyboardZoom,
      MouseWheelZoom: OlMouseWheelZoom,
      DragZoom: OlDragZoom
    };

    return interactions.map((interaction: keyof typeof classMap) => {
      const InteractionClass = classMap[interaction] as typeof OlInteraction;
      if (InteractionClass) {
        return new InteractionClass();
      }
      Logger.warn(`Interaction '${interaction}' not supported.`);
    }).filter((interaction: OlInteraction | undefined) => interaction !== undefined) as OlInteraction[];
  }

  private async fetchLayers(application: T): Promise<S[]|undefined> {
    const layerTree = application.layerTree;

    if (!layerTree) {
      return;
    }

    const layerIds: number[] = this.getLayerIds(layerTree.children);

    if (!this.client) {
      Logger.warn('Cannot fetch the layers in layertree because no ' +
        'SHOGunClient has been provided.');
      return;
    }

    if (layerIds.length === 0) {
      return [];
    }

    try {
      const {
        allLayersByIds: layers
      } = await this.client.graphql().sendQuery<S[]>({
        query: allLayersByIds,
        variables: {
          ids: layerIds
        }
      });

      return layers;
    } catch (e) {
      Logger.warn('Could not parse the layer tree: ', e);
      return [];
    }
  }

  getLayerIds(nodes: DefaultLayerTree[], ids?: number[]) {
    const layerIds: number[] = ids ?? [];

    for (const node of nodes) {
      if (node.children?.length > 0) {
        this.getLayerIds(node.children, layerIds);
      } else {
        if (node.layerId) {
          layerIds.push(node.layerId);
        }
      }
    }

    return layerIds;
  }

  async parseNodes(nodes: DefaultLayerTree[], layers: S[], projection?: OlProjectionLike, keepClientConfig = false) {
    const collection: OlLayerBase[] = [];

    for (const node of nodes) {
      if (node.children?.length > 0) {
        collection.push(await this.parseFolder(node, layers, projection, keepClientConfig));
      } else {
        const layerNode = layers.find(l => l.id === node.layerId);
        if (layerNode) {
          let olLayer;
          try {
            olLayer = await this.parseLayer(layerNode as S, projection);
          } catch (error) {
            Logger.warn('Could not parse layer: ', error);
          }

          if (!olLayer) {
            continue;
          }

          olLayer.setVisible(node.checked);
          if (node.title) {
            olLayer.set('name', node.title);
          }
          if (keepClientConfig) {
            olLayer.set('clientConfig', layerNode.clientConfig);
          }
          collection.push(olLayer);
        }
      }
    }

    return collection;
  }

  async parseFolder(el: DefaultLayerTree, layers: S[], projection?: OlProjectionLike, keepClientConfig = false) {
    const layersInFolder = await this.parseNodes(el.children, layers, projection, keepClientConfig);

    const folder = new OlLayerGroup({
      layers: layersInFolder.reverse()
    });

    folder.set('name', el.title);

    return folder;
  }

  async parseLayer(layer: S, projection?: OlProjectionLike) {
    if (layer.type === 'WMS') {
      return this.parseImageLayer(layer);
    }

    if (layer.type === 'TILEWMS') {
      return this.parseTileLayer(layer, projection);
    }

    if (layer.type === 'WMTS') {
      return await this.parseWMTSLayer(layer, projection);
    }

    if (layer.type === 'WFS') {
      return this.parseWFSLayer(layer, projection);
    }

    if (layer.type === 'OGC_FEATURES') {
      return this.parseOGCFeaturesLayer(layer, projection);
    }

    if (layer.type === 'WMSTIME') {
      return await this.parseWMSTimeLayer(layer);
    }

    if (layer.type === 'XYZ') {
      return this.parseXYZLayer(layer, projection);
    }

    if (layer.type === 'MVT') {
      return this.parseMvtLayer(layer, projection);
    }

    if (layer.type === 'MAPBOXSTYLE') {
      return await this.parseMapboxStyleLayer(layer, projection);
    }

    Logger.error(`Unsupported layer type ${layer.type} given. Currently only WMS, TILEWMS, WMTS, ` +
             'WFS, WMSTIME, XYZ and MAPBOXSTYLE are supported.');

  }

  parseImageLayer(layer: S) {
    const {
      attribution,
      url,
      layerNames,
      useBearerToken,
      requestParams = {
        TRANSPARENT: true
      }
    } = layer.sourceConfig || {};

    const {
      minResolution,
      maxResolution,
      crossOrigin,
      opacity
    } = layer.clientConfig || {};

    const sourceConfig: OlImageWMSOptions = {
      url,
      attributions: attribution,
      params: {
        LAYERS: layerNames,
        ...requestParams
      },
      crossOrigin
    };

    if (useBearerToken) {
      sourceConfig.imageLoadFunction = (imageTile: OlImage, src: string) =>
        this.bearerTokenLoadFunction(imageTile, src, true);
    }
    const source = new OlImageWMS(sourceConfig);

    const imageLayer = new OlImageLayer({
      source,
      minResolution,
      maxResolution,
      opacity
    });

    this.setLayerProperties(imageLayer, layer);

    return imageLayer;
  }

  parseTileLayer(layer: S, projection: OlProjectionLike = 'EPSG:3857') {
    const {
      attribution,
      url,
      layerNames,
      useBearerToken,
      tileSize = 256,
      tileOrigin,
      resolutions,
      requestParams = {
        TRANSPARENT: true
      }
    } = layer.sourceConfig || {};

    const {
      minResolution,
      maxResolution,
      crossOrigin,
      opacity
    } = layer.clientConfig || {};

    let tileGrid;
    if (tileSize && resolutions && tileOrigin) {
      tileGrid = new OlTileGrid({
        resolutions,
        tileSize: [tileSize, tileSize],
        origin: tileOrigin
      });
    }

    const sourceConfig: OlTileWMSOptions = {
      url,
      tileGrid,
      attributions: attribution,
      projection,
      params: {
        LAYERS: layerNames,
        ...requestParams
      },
      crossOrigin
    };

    if (useBearerToken) {
      sourceConfig.tileLoadFunction = (imageTile: OlTile, src: string) =>
        this.bearerTokenLoadFunction(imageTile, src, true);
    }

    const source = new OlTileWMS(sourceConfig);

    const tileLayer = new OlTileLayer({
      source,
      minResolution,
      maxResolution,
      opacity
    });

    this.setLayerProperties(tileLayer, layer);

    return tileLayer;
  }

  async parseWMTSLayer(layer: S, projection: OlProjectionLike = 'EPSG:3857') {
    const {
      attribution,
      url,
      layerNames,
      matrixSet,
      wmtsDimensions
    } = layer.sourceConfig || {};

    const {
      minResolution,
      maxResolution,
      crossOrigin,
      opacity
    } = layer.clientConfig || {};

    const wmtsCapabilitiesParser = new OlWMTSCapabilities();

    const capabilitiesUrl = UrlUtil.createValidGetCapabilitiesRequest(url, 'WMTS');

    let capabilities;
    try {
      const capabilitiesResponse = await fetch(capabilitiesUrl);
      const capabilitiesResponseText = await capabilitiesResponse.text();

      capabilities = wmtsCapabilitiesParser.read(capabilitiesResponseText);
    } catch (error) {
      Logger.error(
        `WMTS layer '${layerNames}' could not be created, error while ` +
          `reading the WMTS GetCapabilities: ${error}`
      );
      return;
    }

    let optionsConfig: any = {
      layer: layerNames,
      projection: projection
    };

    if (matrixSet) {
      optionsConfig = {
        matrixSet,
        ...optionsConfig
      };
    }

    const options = optionsFromCapabilities(capabilities, optionsConfig);

    if (!options) {
      throw new Error('Could not get the options from the capabilities');
    }

    const tileGrid = options.tileGrid;

    if (!tileGrid || !(tileGrid instanceof OlTileGridWMTS)) {
      throw new Error('Cannot build WMTS source without a valid tileGrid instance');
    }

    // update matrix sizes since these can differ from default set (Math.pow(2, x)),
    // which is usually used with EPSG:3857 based tile grids
    const resolutions: number[] = tileGrid.getResolutions();
    const minZoom = tileGrid.getMinZoom();
    const matrixSizes = new Array(length);
    const origins = new Array(length);
    const tileSizes = new Array(length);
    for (let zoomLevel = minZoom; zoomLevel < resolutions?.length; ++zoomLevel) {
      matrixSizes[zoomLevel] = tileGrid.getFullTileRange(zoomLevel)?.getSize();
      origins[zoomLevel] = tileGrid.getOrigin(zoomLevel);
      tileSizes[zoomLevel] = tileGrid.getTileSize(zoomLevel);
    }

    if (wmtsDimensions) {
      for (const [key, value] of Object.entries(wmtsDimensions)) {
        if (!options?.dimensions?.[key]) {
          throw new Error(`Layer has wmtsDimension ${key} configured but the capabilities of the layer only offer ` +
            `dimensions ${Object.keys(options?.dimensions).join(', ')}.`);
        }
        options.dimensions[key] = value;
      }
    }

    const source = new OlSourceWMTS({
      ...options,
      ...{
        tileGrid: new OlTileGridWMTS({
          resolutions: tileGrid.getResolutions(),
          matrixIds: tileGrid.getMatrixIds(),
          extent: tileGrid.getExtent(),
          sizes: matrixSizes,
          origins,
          tileSizes
        }),
        attributions: attribution,
        crossOrigin
      }
    });

    source.set('matrixSizes', matrixSizes);

    let legendUrl = '';
    capabilities.Contents?.Layer?.forEach((l: any) => {
      if (l.Identifier === layerNames) {
        l.Style?.forEach((s: any) => {
          if (s.LegendURL) {
            legendUrl = s.LegendURL[0].href;
          }
        });
      }
    });

    source.set('legendUrl', legendUrl);

    const wmtsLayer = new OlTileLayer({
      source,
      minResolution,
      maxResolution,
      opacity
    });

    this.setLayerProperties(wmtsLayer, layer);

    return wmtsLayer;
  }

  parseWFSLayer(layer: S, projection: OlProjectionLike = 'EPSG:3857') {
    const {
      attribution,
      url,
      layerNames,
      useBearerToken,
      requestParams = {}
    } = layer.sourceConfig || {};

    const {
      minResolution,
      maxResolution,
      opacity
    } = layer.clientConfig || {};

    const source = new OlSourceVector({
      format: new OlFormatGeoJSON(),
      attributions: attribution,
      strategy: olStrategyBbox,
      loader: (extent, resolution, proj, success, failure) => {
        const params = UrlUtil.objectToRequestString({
          SERVICE: 'WFS',
          VERSION: '2.0.0',
          REQUEST: 'GetFeature',
          TYPENAMES: layerNames,
          // TODO: This can be overriden by requestParams, but the source assumes GeoJSON
          OUTPUTFORMAT: 'application/json',
          SRSNAME: projection,
          BBOX: `${extent.join(',')},${projection}`,
          ...requestParams
        });

        this.bearerTokenLoadFunctionVector(url, params, extent, !!useBearerToken, source, success, failure);
      }
    });

    const vectorLayer = new OlLayerVector({
      source,
      minResolution,
      maxResolution,
      opacity
    });

    this.setLayerProperties(vectorLayer, layer);

    return vectorLayer;
  }

  parseOGCFeaturesLayer(layer: S, projection: OlProjectionLike = 'EPSG:3857') {
    const {
      attribution,
      url,
      useBearerToken,
      requestParams = {}
    } = layer.sourceConfig || {};

    const {
      minResolution,
      maxResolution,
      opacity
    } = layer.clientConfig || {};

    const projNum = getProjObject(projection)?.getCode().split(':')[1];

    const source = new OlSourceVector({
      format: new OlFormatGeoJSON(),
      attributions: attribution,
      strategy: olStrategyBbox,
      loader: (extent, resolution, proj, success, failure) => {
        const params = UrlUtil.objectToRequestString({
          bbox: extent.join(','),
          'bbox-crs': projNum,
          crs: projNum,
          ...requestParams
        });

        this.bearerTokenLoadFunctionVector(url, params, extent, !!useBearerToken, source, success, failure);
      }
    });

    const vectorLayer = new OlLayerVector({
      source,
      minResolution,
      maxResolution,
      opacity
    });

    this.setLayerProperties(vectorLayer, layer);

    return vectorLayer;
  }

  async parseWMSTimeLayer(layer: S , projection: OlProjectionLike = 'EPSG:3857') {
    const timeLayer = this.parseTileLayer(layer, projection);

    const layerBaseUrl = layer.sourceConfig.url;
    const wmsVersion = layer.sourceConfig.requestParams?.VERSION as string || '1.3.0';

    const capabilitiesUrl = UrlUtil.createValidGetCapabilitiesRequest(
      layerBaseUrl, 'WMS', wmsVersion);

    const capabilities = await CapabilitiesUtil.getWmsCapabilities(capabilitiesUrl, {
      headers: layer.sourceConfig.useBearerToken ? {
        ...getBearerTokenHeader(this.client?.getKeycloak())
      } : {}
    });

    const layerCapabilities = capabilities.Capability?.Layer?.Layer?.find((l: any) => {
      const layerNameCandidates: string[] = [
        layer.sourceConfig.layerNames,
        layer.sourceConfig.layerNames.split(':')[1]
      ].filter(name => name !== null);

      return layerNameCandidates.includes(l.Name);
    });

    const dimension = layerCapabilities?.Dimension;

    if (!dimension) {
      return timeLayer;
    }

    let timeDimension;

    if (Array.isArray(dimension)) {
      timeDimension = dimension.find((d: any) => d.name === 'time');
    } else {
      timeDimension = dimension.name === 'time' ? dimension : null;
    }

    if (!timeDimension) {
      return timeLayer;
    }

    let timeRange;
    let timeDefault;
    if (wmsVersion === '1.3.0') {
      timeRange = timeDimension['#text'];
      timeDefault = timeDimension.default;
    } else {
      const extent = layerCapabilities?.Extent;
      let timeDimensionExtent;
      if (Array.isArray(extent)) {
        timeDimensionExtent = extent?.find((d: any) => d.name === 'time');
      } else {
        timeDimensionExtent = extent?.name === 'time' ? extent : null;
      }
      if (!timeDimensionExtent) {
        return timeLayer;
      }
      timeRange = timeDimensionExtent['#text'];
      timeDefault = timeDimensionExtent.default;
    }

    timeLayer.set('dimension', {
      name: timeDimension.name,
      values: timeRange
    });

    if (timeDefault) {
      timeLayer.getSource()?.updateParams({
        TIME: timeDefault
      });
    }

    return timeLayer;
  }

  parseXYZLayer(layer: S, projection: OlProjectionLike = 'EPSG:3857') {
    const {
      attribution,
      tileSize = 256,
      url,
      useBearerToken
    } = layer.sourceConfig || {};

    const {
      minResolution,
      maxResolution,
      crossOrigin,
      opacity
    } = layer.clientConfig || {};

    const sourceConfig: OlSourceXYZOptions = {
      attributions: attribution,
      crossOrigin,
      projection,
      tileSize,
      url
    };

    if (useBearerToken) {
      sourceConfig.tileLoadFunction = (imageTile: OlTile, src: string) =>
        this.bearerTokenLoadFunction(imageTile, src, true);
    }

    const source = new OlSourceXYZ(sourceConfig);

    const xyzLayer = new OlTileLayer({
      source,
      minResolution,
      maxResolution,
      opacity
    });

    this.setLayerProperties(xyzLayer, layer);

    return xyzLayer;
  }

  parseMvtLayer(layer: S, projection: OlProjectionLike = 'EPSG:3857') {
    const {
      url,
      useBearerToken
    } = layer.sourceConfig || {};

    const source = new OlSourceVectorTile({
      format: new OlFormatMVT(),
      url,
      projection
    });

    if (!_isNil(useBearerToken)) {
      source.setTileLoadFunction((imageTile: OlTile, src: string) =>
        this.bearerTokenLoadFunction(imageTile, src, true));
    }

    const mvtLayer = new OlVectorTileLayer({
      source
    });

    this.setLayerProperties(mvtLayer, layer);
    return mvtLayer;
  }

  async parseMapboxStyleLayer(layer: S, projection?: OlProjectionLike) {
    const {
      url,
      useBearerToken,
      resolutions
    } = layer.sourceConfig || {};

    const {
      minResolution,
      maxResolution,
      opacity,
    } = layer.clientConfig || {};

    const mapBoxLayerGroup = new OlLayerGroup({
      minResolution,
      maxResolution,
      opacity
    });

    try {
      await applyMapboxStyle(
        mapBoxLayerGroup,
        url,
        {
          projection: (projection instanceof OlProjection) ? projection.getCode() : projection,
          resolutions: resolutions,
          transformRequest: (resourceUrl) => {
            return new Request(resourceUrl, {
              headers: useBearerToken ? {
                ...getBearerTokenHeader(this.client?.getKeycloak())
              } : {}
            });
          }
        }
      );
    } catch (e) {
      Logger.error(`Could apply mapbox style to OlLayerGroup: ${e}`);
    }

    this.setLayerProperties(mapBoxLayerGroup, layer);

    return mapBoxLayerGroup;
  }

  getMapScales(resolutions: number[], projUnit: Units = 'm'): number[] {
    return resolutions
      .map((res: number) =>
        MapUtil.roundScale(MapUtil.getScaleForResolution(res, projUnit) as number
        ))
      .reverse();
  }

  private mergeApplicationLayerConfigs(layers: S[], application: T): void {
    application.layerConfig?.forEach(layerConfig => {
      const layerCandidate = layers.find(layer => layer.id === layerConfig.layerId);

      if (!layerCandidate) {
        return;
      }

      layerCandidate.clientConfig = {
        ...layerCandidate.clientConfig,
        ...layerConfig.clientConfig
      };

      layerCandidate.sourceConfig = {
        ...layerCandidate.sourceConfig,
        ...layerConfig.sourceConfig
      };
    });
  }

  private setLayerProperties(olLayer: OlLayerBase, layer: S): void {
    olLayer.set('shogunId', layer.id);
    olLayer.set('name', layer.name);
    olLayer.set('type', layer.type);
    olLayer.set('searchable', layer.clientConfig?.searchable);
    olLayer.set('propertyConfig', layer.clientConfig?.propertyConfig);
    olLayer.set('downloadConfig', layer.clientConfig?.downloadConfig);
    olLayer.set('searchConfig', layer.clientConfig?.searchConfig);
    olLayer.set('legendUrl', layer.sourceConfig?.legendUrl);
    olLayer.set('hoverable', layer.clientConfig?.hoverable);
    olLayer.set('useBearerToken', layer.sourceConfig?.useBearerToken);
    olLayer.set('editable', layer.clientConfig?.editable);
    olLayer.set('editFormConfig', layer.clientConfig?.editFormConfig);
    olLayer.set('featureInfoFormConfig', layer.clientConfig?.featureInfoFormConfig);
  }

  private async bearerTokenLoadFunctionVector(
    url: string,
    params: string,
    extent: OlExtent,
    useBearerToken: boolean,
    source: OlSourceVector,
    success?: (features: OlFeature<OlGeometry>[]) => void,
    failure?: () => void
  ) {
    try {
      const urlWithParams = `${url}${url.endsWith('?') ? '' : '?'}${params}`;

      const response = await fetch(urlWithParams, {
        headers: useBearerToken ? {
          ...getBearerTokenHeader(this.client?.getKeycloak())
        } : {}
      });

      if (!response.ok) {
        throw new Error('No successful response');
      }

      const features = source.getFormat()?.readFeatures(await response.json());
      if (features) {
        source.addFeatures(features as OlFeature<OlGeometry>[]);
      }

      success?.(features as OlFeature<OlGeometry>[]);
    } catch (error) {
      source.removeLoadedExtent(extent);
      failure?.();
      Logger.error('Error loading features: ', error);
    }
  }

  private async bearerTokenLoadFunction(imageTile: OlTile | OlImage, src: string, useBearerToken = false) {
    try {
      const response = await fetch(src, {
        headers: useBearerToken ? {
          ...getBearerTokenHeader(this.client?.getKeycloak())
        } : {}
      });

      const imageElement = (imageTile as OlImageTile).getImage() as HTMLImageElement;

      if (!response.ok) {
        throw new Error(`No successful response: ${response.status}`);
      }

      const blob = await response.blob();

      if (!/image\/*/.test(blob.type)) {
        throw new Error(`Unexpected format ${blob.type} returned`);
      }

      imageElement.src = URL.createObjectURL(blob);

      imageElement.onload = () => {
        URL.revokeObjectURL(src);
      };
    } catch (error) {
      Logger.error('Error while loading an image tile: ', error);
      (imageTile as OlImageTile).setState(OlTileState.ERROR);
    }
  }
}

export default SHOGunApplicationUtil;
