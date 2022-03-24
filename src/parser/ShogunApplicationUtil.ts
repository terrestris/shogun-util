import OlView, { ViewOptions } from 'ol/View';
import OlTileWMS from 'ol/source/TileWMS';
import OlTileLayer from 'ol/layer/Tile';
import OlImageWMS from 'ol/source/ImageWMS';
import OlSourceWMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import OlImageLayer from 'ol/layer/Image';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlTileGrid from 'ol/tilegrid/TileGrid';
import OlWMTSCapabilities from 'ol/format/WMTSCapabilities';
import {
  fromLonLat,
  ProjectionLike
} from 'ol/proj';

import { UrlUtil } from '@terrestris/base-util/dist/UrlUtil/UrlUtil';

import ProjectionUtil from '@terrestris/ol-util/dist/ProjectionUtil/ProjectionUtil';
import { MapUtil } from '@terrestris/ol-util/dist/MapUtil/MapUtil';

import Application, { DefaultLayerTree } from '../model/Application';
import Layer from '../model/Layer';

import LayerService from '../service/LayerService';

// TODO Make base path configurable
const layerService = new LayerService();

class ShogunApplicationUtil {

  async parseMapView(application: Application, additionalOpts: ViewOptions): Promise<OlView> {
    // TODO Should this be called here?
    ProjectionUtil.initProj4Definitions(null);

    const mapView = application.clientConfig?.mapView;

    if (!mapView) {
      throw new Error('No mapView given');
    }

    const projection = mapView.projection || 'EPSG:3857';
    const zoom = mapView.zoom || 0;
    const resolutions = mapView.resolutions;

    let center;
    if (mapView.center && mapView.center.length === 2) {
      center = fromLonLat([mapView.center[0], mapView.center[1]], projection);
    }

    let extent;
    if (mapView.extent && mapView.extent.length === 4) {
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

  async parseLayerTree(application: Application, projection?: ProjectionLike) {
    const layerTree = application.layerTree;

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
        const layer: Layer = await layerService.findOne(node.layerId);

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

  async parseLayer(layer: Layer, projection?: ProjectionLike): Promise<OlLayerBase> {
    if (layer.type === 'WMTS') {
      return await this.parseWMTSLayer(layer, projection);
    } else if (layer.type === 'WMS') {
      return this.parseImageLayer(layer);
    } else if (layer.type === 'TILEWMS') {
      return this.parseTileLayer(layer, projection);
    } else {
      throw new Error('Currently only WMTS, WMS and TILEWMS layers are supported.');
    }
  }

  parseTileLayer(layer: Layer, projection?: ProjectionLike) {
    const {
      sourceConfig,
      clientConfig
    } = layer;

    const {
      url,
      layerNames,
      attribution,
      legendUrl,
      tileSize = 256,
      tileOrigin,
      resolutions
    } = sourceConfig || {};

    const {
      hoverable,
      searchable,
      propertyConfig,
      minResolution,
      crossOrigin,
      maxResolution,
    } = clientConfig || {};

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
        'LAYERS': layerNames
      },
      crossOrigin
    });

    const tileLayer = new OlTileLayer({
      source,
      minResolution,
      maxResolution
    });

    tileLayer.set('shogunId', layer.id);
    tileLayer.set('name', layer.name);
    tileLayer.set('hoverable', hoverable);
    tileLayer.set('type', layer.type);
    tileLayer.set('legendUrl', legendUrl);
    tileLayer.set('searchable', searchable);
    tileLayer.set('propertyConfig', propertyConfig);

    return tileLayer;
  }

  parseImageLayer(layer: Layer) {
    const {
      attribution,
      legendUrl,
      url,
      layerNames,
    } = layer.sourceConfig;

    const {
      hoverable,
      crossOrigin,
      searchable,
      propertyConfig,
    } = layer.clientConfig;

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
      source
    });

    imageLayer.set('shogunId', layer.id);
    imageLayer.set('name', layer.name);
    imageLayer.set('hoverable', hoverable);
    imageLayer.set('type', layer.type);
    imageLayer.set('legendUrl', legendUrl);
    imageLayer.set('searchable', searchable);
    imageLayer.set('propertyConfig', propertyConfig);

    return imageLayer;
  }

  async parseWMTSLayer(layer: Layer, projection: ProjectionLike = 'EPSG:3857') {
    const {
      attribution,
      url,
      layerNames,
      legendUrl
    } = layer.sourceConfig || {};

    const {
      searchable,
      propertyConfig,
      crossOrigin,
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
      visible: false
    });

    wmtsLayer.set('shogunId', layer.id);
    wmtsLayer.set('name', layer.name);
    wmtsLayer.set('type', layer.type);
    wmtsLayer.set('searchable', searchable);
    wmtsLayer.set('propertyConfig', propertyConfig);
    wmtsLayer.set('legendUrl', legendUrl);

    return wmtsLayer;
  }

  getMapScales(resolutions: number[], projUnit: string = 'm'): number[] {
    return resolutions
      .map((res: number) =>
        MapUtil.roundScale(MapUtil.getScaleForResolution(res, projUnit)
        ))
      .reverse();
  }
}

export default ShogunApplicationUtil;
