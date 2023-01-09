import BaseEntity, { BaseEntityArgs } from './BaseEntity';
import {
  DefaultLayerClientConfig,
  DefaultLayerSourceConfig
} from './Layer';

export interface DefaultApplicationTheme {
  primaryColor?: string;
  secondaryColor?: string;
  complementaryColor?: string;
  logoPath?: string;
}

export interface DefaultApplicationToolConfig {
  name: string;
  config: any;
}

export interface DefaultApplicationLayerConfig {
  layerId: number;
  clientConfig?: DefaultLayerClientConfig;
  sourceConfig?: DefaultLayerSourceConfig;
}

export interface DefaultLayerTree {
  title?: string;
  checked?: boolean;
  layerId?: number | string;
  children?: DefaultLayerTree[];
}

export interface DefaultMapView {
  zoom?: number;
  center?: [number, number];
  extent?: [number, number, number, number];
  projection?: string;
  resolutions?: number[];
}

export interface DefaultApplicationClientConfig {
  mapView: DefaultMapView;
  description?: string;
  theme?: DefaultApplicationTheme;
}

export interface ApplicationArgs extends BaseEntityArgs {
  name?: string;
  stateOnly?: boolean;
  clientConfig?: DefaultApplicationClientConfig;
  layerTree?: DefaultLayerTree;
  layerConfig?: DefaultApplicationLayerConfig[];
  toolConfig?: DefaultApplicationToolConfig[];
}

export default class Application extends BaseEntity {
  name?: string;
  stateOnly?: boolean;
  clientConfig?: DefaultApplicationClientConfig;
  layerTree?: DefaultLayerTree;
  layerConfig?: DefaultApplicationLayerConfig[];
  toolConfig?: DefaultApplicationToolConfig[];

  constructor({
    id,
    created,
    modified,
    name,
    stateOnly,
    clientConfig,
    layerTree,
    layerConfig,
    toolConfig
  }: ApplicationArgs) {
    super({id, created, modified});

    this.name = name;
    this.stateOnly = stateOnly;
    this.clientConfig = clientConfig;
    this.layerTree = layerTree;
    this.layerConfig = layerConfig;
    this.toolConfig = toolConfig;
  }
}
