import OlView, { ViewOptions as OlViewOptions } from 'ol/View';
import OlTileWMS from 'ol/source/TileWMS';
import OlTileLayer from 'ol/layer/Tile';
import OlImageWMS from 'ol/source/ImageWMS';
import OlSourceWMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import OlImageLayer from 'ol/layer/Image';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlTileGrid from 'ol/tilegrid/TileGrid';
import OlTileGridWMTS from 'ol/tilegrid/WMTS';
import OlSourceVector from 'ol/source/Vector';
import OlWMTSCapabilities from 'ol/format/WMTSCapabilities';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlLayerVector from 'ol/layer/Vector';
import OlImageTile from 'ol/ImageTile';
import OlTile from 'ol/Tile';
import OlImage from 'ol/Image';
import OlGeometry from 'ol/geom/Geometry';
import OlFeature from 'ol/Feature';
import { Extent as OlExtent } from 'ol/extent';
import {
  fromLonLat,
  ProjectionLike as OlProjectionLike
} from 'ol/proj';
import { bbox as olStrategyBbox } from 'ol/loadingstrategy';

import { UrlUtil } from '@terrestris/base-util/dist/UrlUtil/UrlUtil';
import Logger from '@terrestris/base-util/dist/Logger';

import ProjectionUtil from '@terrestris/ol-util/dist/ProjectionUtil/ProjectionUtil';
import { MapUtil } from '@terrestris/ol-util/dist/MapUtil/MapUtil';

import Application, { DefaultLayerTree } from '../model/Application';
import Layer from '../model/Layer';

import SHOGunAPIClient from '../service/SHOGunAPIClient';

import { getBearerTokenHeader } from '../security/getBearerTokenHeader';

import {
  allLayersByIds
} from '../graphqlqueries/Layers';

export interface SHOGunApplicationUtilOpts {
  client?: SHOGunAPIClient;
}

class SHOGunApplicationUtil<T extends Application, S extends Layer> {

  private client: SHOGunAPIClient | undefined;

  constructor(opts?: SHOGunApplicationUtilOpts) {
    // TODO Default client?
    this.client = opts?.client;
  }

  async parseMapView(application: T, additionalOpts?: OlViewOptions): Promise<OlView> {
    // TODO Should this be called here?
    ProjectionUtil.initProj4Definitions(null);

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

    const view = new OlView({
      projection,
      center,
      zoom,
      extent,
      resolutions,
      ...additionalOpts
    });

    return view;
  }

  async parseLayerTree(application: T, projection?: OlProjectionLike) {
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
        const { allLayersByIds: layers } = await this.client.graphql().sendQuery<Layer>({
          query: allLayersByIds,
          variables: {
            ids: layerIds
          }
        });
        if (layerTree.children) {
          const nodes = await this.parseNodes(layerTree.children, layers, projection);

          const tree = new OlLayerGroup({
            layers: nodes.reverse(),
            visible: layerTree.checked
          });
          return tree;
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
        layerIds.push(node.layerId);
      }
    }
    return layerIds;
  }

  async parseNodes(nodes: DefaultLayerTree[], layers: Layer[], projection?: OlProjectionLike) {
    const collection: OlLayerBase[] = [];

    for (const node of nodes) {
      if (node.children?.length > 0) {
        collection.push(await this.parseFolder(node, layers, projection));
      } else {
        const layerNode = layers.find(l => l.id === node.layerId);
        if (layerNode) {
          const olLayer = await this.parseLayer(layerNode as S, projection);
          olLayer.setVisible(node.checked);
          collection.push(olLayer);
        }
      }
    }
    return collection;
  }

  async parseFolder(el: DefaultLayerTree, layers: Layer[], projection?: OlProjectionLike) {
    const layersInFolder = await this.parseNodes(el.children, layers, projection);

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

    // TODO Add support for VECTORTILE, XYZ and WMSTime
    throw new Error('Currently only WMTS, WMS, TILEWMS and WFS layers are supported.');
  }

  parseImageLayer(layer: S) {
    const {
      attribution,
      url,
      layerNames,
      useBearerToken,
      requestParams = { 'TRANSPARENT': true }
    } = layer.sourceConfig || {};

    const {
      minResolution,
      maxResolution,
      crossOrigin
    } = layer.clientConfig || {};

    const source = new OlImageWMS({
      url,
      attributions: attribution,
      params: {
        'LAYERS': layerNames,
        ...requestParams
      },
      crossOrigin,
      imageLoadFunction: (imageTile, src) => this.bearerTokenLoadFunction(imageTile, src, useBearerToken)
    });

    const imageLayer = new OlImageLayer({
      source,
      minResolution,
      maxResolution
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
      requestParams = { 'TRANSPARENT': true }
    } = layer.sourceConfig || {};

    const {
      minResolution,
      maxResolution,
      crossOrigin
    } = layer.clientConfig || {};

    let tileGrid;
    if (tileSize && resolutions && tileOrigin) {
      tileGrid = new OlTileGrid({
        resolutions,
        tileSize: [tileSize, tileSize],
        origin: tileOrigin
      });
    }

    const source = new OlTileWMS({
      url,
      tileGrid,
      attributions: attribution,
      projection,
      params: {
        'LAYERS': layerNames,
        ...requestParams
      },
      crossOrigin,
      tileLoadFunction: (imageTile, src) => this.bearerTokenLoadFunction(imageTile, src, useBearerToken)
    });

    const tileLayer = new OlTileLayer({
      source,
      minResolution,
      maxResolution
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
      crossOrigin
    } = layer.clientConfig || {};

    const wmtsCapabilitiesParser = new OlWMTSCapabilities();

    const capabilitiesUrl = UrlUtil.createValidGetCapabilitiesRequest(url, 'WMTS');

    let capabilities;
    try {
      const capabilitiesResponse = await fetch(capabilitiesUrl);
      const capabilitiesResponseText = await capabilitiesResponse.text();

      capabilities = wmtsCapabilitiesParser.read(capabilitiesResponseText);
    } catch (error) {
      throw new Error(`WMTS layer '${layerNames}' could not be created, error while ` +
        `reading the WMTS GetCapabilities: ${error}`);
    }

    let optionsConfig: Object = {
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

    const wmtsLayer = new OlTileLayer({
      source,
      minResolution,
      maxResolution
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
      maxResolution
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
      maxResolution
    });

    this.setLayerProperties(vectorLayer, layer);

    return vectorLayer;
  }

  getMapScales(resolutions: number[], projUnit: string = 'm'): number[] {
    return resolutions
      .map((res: number) =>
        MapUtil.roundScale(MapUtil.getScaleForResolution(res, projUnit)
        ))
      .reverse();
  }

  private setLayerProperties(olLayer: OlLayerBase, layer: S) {
    olLayer.set('shogunId', layer.id);
    olLayer.set('name', layer.name);
    olLayer.set('type', layer.type);
    olLayer.set('searchable', layer.clientConfig?.searchable);
    olLayer.set('propertyConfig', layer.clientConfig?.propertyConfig);
    olLayer.set('legendUrl', layer.sourceConfig.legendUrl);
    olLayer.set('hoverable', layer.clientConfig?.hoverable);
    olLayer.set('useBearerToken', layer.sourceConfig?.useBearerToken);
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

      imageElement.src = URL.createObjectURL(await response.blob());
    } catch (error) {
      Logger.error('Error while loading WMS: ', error);
    }
  }
}

export default SHOGunApplicationUtil;
