import OlView, { ViewOptions } from 'ol/View';
import OlTileWMS from 'ol/source/TileWMS';
import OlTileLayer from 'ol/layer/Tile';
import OlImageWMS from 'ol/source/ImageWMS';
import OlSourceWMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import OlImageLayer from 'ol/layer/Image';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlTileGrid from 'ol/tilegrid/TileGrid';
import OlSourceVector from 'ol/source/Vector';
import OlWMTSCapabilities from 'ol/format/WMTSCapabilities';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlLayerVector from 'ol/layer/Vector';
import {
  fromLonLat,
  ProjectionLike
} from 'ol/proj';
import { bbox as olStrategyBbox } from 'ol/loadingstrategy';

import { UrlUtil } from '@terrestris/base-util/dist/UrlUtil/UrlUtil';

import ProjectionUtil from '@terrestris/ol-util/dist/ProjectionUtil/ProjectionUtil';
import { MapUtil } from '@terrestris/ol-util/dist/MapUtil/MapUtil';

import Application, { DefaultLayerTree } from '../model/Application';
import Layer from '../model/Layer';

import SHOGunClient from '../service/SHOGunClient';
import Logger from '@terrestris/base-util/dist/Logger';

export interface ShogunApplicationUtilOpts {
  client?: SHOGunClient;
}

class ShogunApplicationUtil<T extends Application, S extends Layer> {

  private client: SHOGunClient | undefined;

  constructor(opts?: ShogunApplicationUtilOpts) {
    // TODO Default client?
    this.client = opts?.client;
  }

  async parseMapView(application: T, additionalOpts?: ViewOptions): Promise<OlView> {
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

  async parseLayerTree(application: T, projection?: ProjectionLike) {
    const layerTree = application.layerTree;

    if (!layerTree) {
      return;
    }

    const nodes = await this.parseNodes(layerTree.children, projection);

    const tree = new OlLayerGroup({
      layers: nodes.reverse(),
      visible: layerTree.checked
    });

    return tree;
  }

  async parseNodes(nodes: DefaultLayerTree[], projection?: ProjectionLike) {
    const collection: OlLayerBase[] = [];

    for (const node of nodes) {
      if (node.children) {
        collection.push(await this.parseFolder(node, projection));
      } else {
        if (!this.client) {
          Logger.warn(`Couldn\'t parse the layer with ID ${node.layerId} because no ` +
            'SHOGunClient has been provided.');

          continue;
        }

        // TODO Fetch via graphlQL (multiple at once)
        const layer = await this.client.layer<S>().findOne(node.layerId);

        const olLayer = await this.parseLayer(layer, projection);

        olLayer.setVisible(node.checked);

        collection.push(olLayer);
      }
    }

    return collection;
  }

  async parseFolder(el: DefaultLayerTree, projection?: ProjectionLike) {
    const layers = await this.parseNodes(el.children, projection);

    const folder = new OlLayerGroup({
      layers: layers.reverse(),
      visible: el.checked
    });

    folder.set('name', el.title);

    return folder;
  }

  async parseLayer(layer: S, projection?: ProjectionLike) {
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
      layerNames
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
        'TRANSPARENT': true
      },
      crossOrigin
    });

    const imageLayer = new OlImageLayer({
      source,
      minResolution,
      maxResolution
    });

    this.setLayerProperties(imageLayer, layer);

    return imageLayer;
  }

  parseTileLayer(layer: S, projection: ProjectionLike = 'EPSG:3857') {
    const {
      attribution,
      url,
      layerNames,
      tileSize = 256,
      tileOrigin,
      resolutions
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
        'TRANSPARENT': true
      },
      crossOrigin
    });

    const tileLayer = new OlTileLayer({
      source,
      minResolution,
      maxResolution
    });

    this.setLayerProperties(tileLayer, layer);

    return tileLayer;
  }

  async parseWMTSLayer(layer: S, projection: ProjectionLike = 'EPSG:3857') {
    const {
      attribution,
      url,
      layerNames
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

    const options = optionsFromCapabilities(capabilities, {
      layer: layerNames,
      projection: projection
    });

    if (!options) {
      throw new Error('Could not get the options from the capabilities');
    }

    const source = new OlSourceWMTS({
      ...options,
      ...{
        attributions: attribution,
        crossOrigin
      }
    });

    const wmtsLayer = new OlTileLayer({
      source,
      minResolution,
      maxResolution
    });

    this.setLayerProperties(wmtsLayer, layer);

    return wmtsLayer;
  }

  parseWFSLayer(layer: S, projection: ProjectionLike = 'EPSG:3857') {
    const {
      attribution,
      url,
      layerNames
    } = layer.sourceConfig || {};

    const {
      minResolution,
      maxResolution
    } = layer.clientConfig || {};

    const source = new OlSourceVector({
      format: new OlFormatGeoJSON(),
      attributions: attribution,
      url: extent => {
        const params = UrlUtil.objectToRequestString({
          SERVICE: 'WFS',
          VERSION: '2.0.0',
          REQUEST: 'GetFeature',
          TYPENAMES: layerNames,
          OUTPUTFORMAT: 'application/json',
          SRSNAME: projection,
          BBOX: `${extent.join(',')},${projection}`
        });

        return `${url}${url.endsWith('?') ? '' : '?'}${params}`;
      },
      strategy: olStrategyBbox
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
  }
}

export default ShogunApplicationUtil;
