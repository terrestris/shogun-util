import Logger from '@terrestris/base-util/dist/Logger';
import { UrlUtil } from '@terrestris/base-util/dist/UrlUtil/UrlUtil';
import CapabilitiesUtil from '@terrestris/ol-util/dist/CapabilitiesUtil/CapabilitiesUtil';
import { MapUtil } from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import ProjectionUtil, { defaultProj4CrsDefinitions } from '@terrestris/ol-util/dist/ProjectionUtil/ProjectionUtil';
import _uniqueBy from 'lodash/uniqBy';
import { Extent as OlExtent } from 'ol/extent';
import OlFeature from 'ol/Feature';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlWMTSCapabilities from 'ol/format/WMTSCapabilities';
import OlGeometry from 'ol/geom/Geometry';
import OlImage from 'ol/Image';
import OlImageTile from 'ol/ImageTile';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlImageLayer from 'ol/layer/Image';
import OlTileLayer from 'ol/layer/Tile';
import OlLayerVector from 'ol/layer/Vector';
import { bbox as olStrategyBbox } from 'ol/loadingstrategy';
import { fromLonLat, ProjectionLike as OlProjectionLike } from 'ol/proj';
import { Units } from 'ol/proj/Units';
import OlImageWMS from 'ol/source/ImageWMS';
import OlTileWMS from 'ol/source/TileWMS';
import OlSourceVector from 'ol/source/Vector';
import OlSourceWMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import OlTile from 'ol/Tile';
import OlTileGrid from 'ol/tilegrid/TileGrid';
import OlTileGridWMTS from 'ol/tilegrid/WMTS';
import OlView, { ViewOptions as OlViewOptions } from 'ol/View';

import {
  allLayersByIds
} from '../graphqlqueries/Layers';
import Application, { DefaultLayerTree } from '../model/Application';
import Layer from '../model/Layer';
import { getBearerTokenHeader } from '../security/getBearerTokenHeader';
import SHOGunAPIClient from '../service/SHOGunAPIClient';

export interface SHOGunApplicationUtilOpts {
  client?: SHOGunAPIClient;
}

class SHOGunApplicationUtil<T extends Application, S extends Layer> {

  private readonly client: SHOGunAPIClient | undefined;

  private readonly objectUrls: any = {};

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
    const resolutions = mapView?.resolutions || [];

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
    const layerTree = application.layerTree;

    if (!layerTree) {
      return;
    }

    if (!this.client) {
      Logger.warn('Cannot parse the layers in layertree because no ' +
        'SHOGunClient has been provided.');
      return;
    }

    let layerIds: number[] = this.getLayerIds(layerTree.children);

    if (layerIds.length > 0) {
      try {
        const {
          allLayersByIds: layers
        } = await this.client.graphql().sendQuery<S[]>({
          query: allLayersByIds,
          variables: {
            ids: layerIds
          }
        });

        this.mergeApplicationLayerConfigs(layers, application);

        if (layerTree.children) {
          const nodes = await this.parseNodes(layerTree.children, layers, projection, keepClientConfig);

          return new OlLayerGroup({
            layers: nodes.reverse(),
            visible: layerTree.checked
          });
        }
      } catch (e) {
        Logger.warn('Could not parse the layer tree: ' + e);
        return new OlLayerGroup();
      }
    }
    return new OlLayerGroup();
  }

  getLayerIds(nodes: DefaultLayerTree[], ids?: number[]) {
    let layerIds: number[] = ids ?? [];

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
          const olLayer = await this.parseLayer(layerNode as S, projection);

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
      layers: layersInFolder.reverse(),
      visible: el.checked
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

    if (layer.type === 'WMSTime') {
      return await this.parseWMSTimeLayer(layer);
    }

    // TODO Add support for VECTORTILE and XYZ
    throw new Error('Currently only WMTS, WMS, TILEWMS, WFS and WMSTime layers are supported.');
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

    const sourceConfig: any = {
      url,
      attributions: attribution,
      params: {
        LAYERS: layerNames,
        ...requestParams
      },
      crossOrigin
    };
    if (useBearerToken) {
      sourceConfig.imageLoadFunction = (imageTile: any, src: any) => this.bearerTokenLoadFunction(imageTile, src, true);
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

    const sourceConfig: any = {
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
      sourceConfig.tileLoadFunction = (imageTile: any, src: any) => this.bearerTokenLoadFunction(imageTile, src, true);
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
      matrixSet
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
      matrixSizes[zoomLevel] = tileGrid.getFullTileRange(zoomLevel).getSize();
      origins[zoomLevel] = tileGrid.getOrigin(zoomLevel);
      tileSizes[zoomLevel] = tileGrid.getTileSize(zoomLevel);
    }

    const source = new OlSourceWMTS({
      ...options,
      ...{
        tileGrid: new OlTileGridWMTS({
          resolutions: tileGrid.getResolutions(),
          matrixIds: tileGrid.getMatrixIds(),
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
      useBearerToken
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
        this.bearerTokenLoadFunctionVector({
          source,
          url,
          layerNames,
          extent,
          resolution,
          projection,
          success,
          failure
        }, useBearerToken);
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
    olLayer.set('legendUrl', layer.sourceConfig.legendUrl);
    olLayer.set('hoverable', layer.clientConfig?.hoverable);
    olLayer.set('useBearerToken', layer.sourceConfig?.useBearerToken);
    olLayer.set('editable', layer.clientConfig?.editable);
    olLayer.set('editFormConfig', layer.clientConfig?.editFormConfig);
    olLayer.set('featureInfoFormConfig', layer.clientConfig?.featureInfoFormConfig);
  }

  private async bearerTokenLoadFunctionVector(opts: {
    source: OlSourceVector;
    url: string;
    layerNames: string;
    extent: OlExtent;
    resolution: number;
    projection: OlProjectionLike;
    success?: (features: OlFeature<OlGeometry>[]) => void;
    failure?: () => void;
  }, useBearerToken: boolean = false) {
    try {
      const params = UrlUtil.objectToRequestString({
        SERVICE: 'WFS',
        VERSION: '2.0.0',
        REQUEST: 'GetFeature',
        TYPENAMES: opts.layerNames,
        OUTPUTFORMAT: 'application/json',
        SRSNAME: opts.projection,
        BBOX: `${opts.extent.join(',')},${opts.projection}`
      });

      const wfsUrl = `${opts.url}${opts.url.endsWith('?') ? '' : '?'}${params}`;

      const response = await fetch(wfsUrl, {
        headers: useBearerToken ? {
          ...getBearerTokenHeader(this.client?.getKeycloak())
        } : {}
      });

      if (!response.ok) {
        throw new Error('No successful response');
      }

      const features = opts.source.getFormat()?.readFeatures(await response.json());
      if (features) {
        opts.source.addFeatures(features as OlFeature<OlGeometry>[]);
      }

      if (opts.success) {
        opts.success(features as OlFeature<OlGeometry>[]);
      }
    } catch (error) {
      opts.source.removeLoadedExtent(opts.extent);
      if (opts.failure) {
        opts.failure();
      }
      Logger.error('Error loading WFS: ', error);
    }
  }

  private async bearerTokenLoadFunction(imageTile: OlTile | OlImage, src: string, useBearerToken: boolean = false) {
    try {
      if (this.objectUrls[src]) {
        URL.revokeObjectURL(this.objectUrls[src]);
      }
      const response = await fetch(src, {
        headers: useBearerToken ? {
          ...getBearerTokenHeader(this.client?.getKeycloak())
        } : {}
      });

      const imageElement = (imageTile as OlImageTile).getImage() as HTMLImageElement;

      if (!response.ok) {
        imageElement.src = src;
        return;
      }

      this.objectUrls[src] = URL.createObjectURL(await response.blob());
      imageElement.src = this.objectUrls[src];
    } catch (error) {
      Logger.error('Error while loading WMS: ', error);
    }
  }
}

export default SHOGunApplicationUtil;
