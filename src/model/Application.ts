import {
  CrsDefinition
} from '@terrestris/ol-util/dist/ProjectionUtil/ProjectionUtil';

import BaseEntity, {
  BaseEntityArgs
} from './BaseEntity';
import {
  DefaultLayerClientConfig,
  DefaultLayerSourceConfig
} from './Layer';

export type MapInteraction = 'DragRotate' |
'DragRotateAndZoom' |
'DblClickDragZoom' |
'DoubleClickZoom' |
'DragPan' |
'PinchRotate' |
'PinchZoom' |
'KeyboardPan' |
'KeyboardZoom' |
'MouseWheelZoom' |
'DragZoom';

export interface DefaultApplicationTheme {
  primaryColor?: string;
  secondaryColor?: string;
  complementaryColor?: string;
  logoPath?: string;
  faviconPath?: string;
  toolMenuWidth?: number;
}

export interface DefaultApplicationToolConfig {
  name: string;
  config: any;
}

export interface DefaultApplicationLayerConfig<
  ClientConfig extends DefaultLayerClientConfig = DefaultLayerClientConfig,
  SourceConfig extends DefaultLayerSourceConfig = DefaultLayerSourceConfig
> {
  layerId: number;
  clientConfig?: ClientConfig;
  sourceConfig?: SourceConfig;
}

export interface DefaultLayerTree {
  title: string;
  checked: boolean;
  layerId: number;
  children: DefaultLayerTree[];
}

export interface DefaultMapView {
  zoom?: number;
  center?: [number, number];
  extent?: [number, number, number, number];
  projection?: string;
  resolutions?: number[];
  crsDefinitions?: CrsDefinition[];
}
export interface DefaultLegalConfig {
  contact?: string;
  imprint?: string;
  privacy?: string;
}

export interface DefaultApplicationClientConfig<
  MapView extends DefaultMapView = DefaultMapView,
  LegalConfig extends DefaultLegalConfig = DefaultLegalConfig,
  ApplicationTheme extends DefaultApplicationTheme = DefaultApplicationTheme
> {
  mapView: MapView;
  mapInteractions?: MapInteraction[];
  description?: string;
  legal?: LegalConfig;
  theme?: ApplicationTheme;
  defaultLanguage?: string;
  printApp?: string;
}

export interface ApplicationArgs<
  ClientConfig extends DefaultApplicationClientConfig = DefaultApplicationClientConfig,
  LayerTree extends DefaultLayerTree = DefaultLayerTree,
  LayerConfig extends DefaultApplicationLayerConfig = DefaultApplicationLayerConfig,
  ToolConfig extends DefaultApplicationToolConfig = DefaultApplicationToolConfig
> extends BaseEntityArgs {
  name?: string;
  stateOnly?: boolean;
  clientConfig?: ClientConfig;
  layerTree?: LayerTree;
  layerConfig?: LayerConfig[];
  toolConfig?: ToolConfig[];
}

export default class Application<
  ClientConfig extends DefaultApplicationClientConfig = DefaultApplicationClientConfig,
  LayerTree extends DefaultLayerTree = DefaultLayerTree,
  LayerConfig extends DefaultApplicationLayerConfig = DefaultApplicationLayerConfig,
  ToolConfig extends DefaultApplicationToolConfig = DefaultApplicationToolConfig
> extends BaseEntity {
  name?: string;
  stateOnly?: boolean;
  clientConfig?: ClientConfig;
  layerTree?: LayerTree;
  layerConfig?: LayerConfig[];
  toolConfig?: ToolConfig[];

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
  }: ApplicationArgs<ClientConfig, LayerTree, LayerConfig, ToolConfig>) {
    super({id, created, modified});

    this.name = name;
    this.stateOnly = stateOnly;
    this.clientConfig = clientConfig;
    this.layerTree = layerTree;
    this.layerConfig = layerConfig;
    this.toolConfig = toolConfig;
  }
}
