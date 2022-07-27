import { FeatureCollection } from 'geojson';
import BaseEntity, { BaseEntityArgs } from './BaseEntity';
import LayerType from './enum/LayerType';

export interface DefaultRequestParams {
  [key: string]: string | number | boolean;
}

export interface DefaultLayerSourceConfig {
  url: string;
  layerNames: string;
  legendUrl?: string;
  tileSize?: number;
  tileOrigin?: [number, number];
  resolutions?: number[];
  attribution?: string;
  requestParams?: DefaultRequestParams;
  useBearerToken?: boolean;
}

export interface DefaultLayerPropertyConfig {
  propertyName: string;
  displayName?: string;
  visible?: boolean;
}

export interface DefaultLayerClientConfig {
  minResolution?: number;
  maxResolution?: number;
  hoverable?: boolean;
  searchable?: boolean;
  propertyConfig?: DefaultLayerPropertyConfig[];
  crossOrigin?: string;
}

export interface LayerArgs extends BaseEntityArgs {
  name: string;
  clientConfig?: DefaultLayerClientConfig;
  sourceConfig: DefaultLayerSourceConfig;
  features?: FeatureCollection;
  type: LayerType;
}

export default class Layer extends BaseEntity {
  name: string;
  clientConfig?: DefaultLayerClientConfig;
  sourceConfig: DefaultLayerSourceConfig;
  features?: FeatureCollection;
  type: LayerType;

  constructor({id, created, modified, clientConfig, features, name, sourceConfig, type}: LayerArgs) {
    super({id, created, modified});

    this.name = name;
    this.clientConfig = clientConfig;
    this.sourceConfig = sourceConfig;
    this.features = features;
    this.type = type;
  }
}
