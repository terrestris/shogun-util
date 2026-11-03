import { FeatureCollection } from 'geojson';

import { Coordinate as OlCoordinate } from 'ol/coordinate';
import { ProjectionLike as OlProjectionLike } from 'ol/proj';
import { Size as OlSize } from 'ol/size';

import BaseEntity, { BaseEntityArgs } from './BaseEntity';
import EditFormComponentType from './enum/EditFormComponentType';
import LayerType from './enum/LayerType';

export type DefaultRequestParams = Record<string, string | number | boolean>;

export interface DefaultLayerSourceConfig {
  attribution?: string;
  crossOrigin?: string;
  layerNames: string;
  legendUrl?: string;
  matrixSet?: string;
  requestParams?: DefaultRequestParams;
  resolutions?: number[];
  tileOrigin?: [number, number];
  tileSize?: number;
  url: string;
  useBearerToken?: boolean;
  wmtsDimensions?: Record<string, string>;
}

export interface DefaultLayerSourceConfigWMTS
  extends Omit<DefaultLayerSourceConfig, 'layerNames' | 'tileOrigin' | 'tileSize' | 'resolutions' | 'matrixSet'> {
  format?: string;
  matrixSet: string;
  projection?: OlProjectionLike;
  requestEncoding?: 'REST' | 'KVP';
  tileGrid: {
    origins: OlCoordinate[];
    resolutions: number[];
    matrixIds: string[];
    tileSizes?: OlSize[];
    matrixSizes: OlSize[];
  };
  urls: string[];
  wmtsLayerName: string;
  wmtsStyle: string;
  wmsFeatureType?: string;
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
  resultDrawerConfig?: PropertyFormTabConfig<PropertyFormItemReadConfig>;
}

export interface DefaultLayerClientConfig {
  crossOrigin?: string;
  downloadConfig?: DownloadConfig[];
  editFormConfig?: PropertyFormTabConfig<PropertyFormItemEditDefaultConfig |
    PropertyFormItemEditReferenceTableConfig>[];
  editable?: boolean;
  featureInfoFormConfig?: PropertyFormTabConfig<PropertyFormItemReadConfig>[];
  hoverable?: boolean;
  maxResolution?: number;
  minResolution?: number;
  opacity?: number;
  propertyConfig?: DefaultLayerPropertyConfig[];
  searchConfig?: SearchConfig;
  searchable?: boolean;
  styleUrl?: string;
}

export interface LayerArgs<
  D extends DefaultLayerClientConfig,
  S extends DefaultLayerSourceConfig
> extends BaseEntityArgs {
  name: string;
  clientConfig?: D;
  sourceConfig: S;
  features?: FeatureCollection;
  type: LayerType;
}

export default class Layer<
  D extends DefaultLayerClientConfig = DefaultLayerClientConfig,
  S extends DefaultLayerSourceConfig = DefaultLayerSourceConfig,
> extends BaseEntity {
  name: string;
  clientConfig?: D;
  sourceConfig: S;
  features?: FeatureCollection;
  type: LayerType;

  constructor({id, created, modified, clientConfig, features, name, sourceConfig, type}: LayerArgs<D, S>) {
    super({id, created, modified});

    this.name = name;
    this.clientConfig = clientConfig;
    this.sourceConfig = sourceConfig;
    this.features = features;
    this.type = type;
  }
}
