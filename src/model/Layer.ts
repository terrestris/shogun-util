import { FeatureCollection } from 'geojson';

import BaseEntity, { BaseEntityArgs } from './BaseEntity';
import EditFormComponentType from './enum/EditFormComponentType';
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
  matrixSet?: string;
  requestParams?: DefaultRequestParams;
  useBearerToken?: boolean;
}

export interface DefaultLayerPropertyConfig {
  propertyName: string;
  displayName?: string;
}

export interface PropertyFormItemReadConfig extends DefaultLayerPropertyConfig {
  fieldProps?: any;
}

export interface PropertyFormItemEditConfig extends PropertyFormItemReadConfig {
  component: EditFormComponentType;
  readOnly?: boolean;
  required?: boolean;
}

export interface PropertyFormItemEditDefaultConfig extends PropertyFormItemEditConfig {}

export interface PropertyFormItemEditReferenceTableConfig extends PropertyFormItemEditConfig {
  editFormConfig: PropertyFormItemEditConfig[];
  tablePropertyName?: string;
}

export interface PropertyFormTabConfig<T extends PropertyFormItemReadConfig> {
  title: string;
  children?: T[];
}

export interface DownloadConfig {
  downloadUrl: string;
  formatName?: string;
}

export interface SearchConfig {
  attributes?: string[];
  displayTemplate?: string;
}

export interface DefaultLayerClientConfig {
  minResolution?: number;
  maxResolution?: number;
  hoverable?: boolean;
  searchable?: boolean;
  searchConfig?: SearchConfig;
  propertyConfig?: DefaultLayerPropertyConfig[];
  featureInfoFormConfig?: PropertyFormTabConfig<PropertyFormItemReadConfig>[];
  editFormConfig?: PropertyFormTabConfig<PropertyFormItemEditDefaultConfig |
    PropertyFormItemEditReferenceTableConfig>[];
  crossOrigin?: string;
  opacity?: number;
  downloadConfig?: DownloadConfig[];
  editable?: boolean;
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
