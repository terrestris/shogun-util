import BaseEntity, { BaseEntityArgs } from './BaseEntity';

export interface ProviderRoleDetails {}

export interface KeycloakRoleComposites {
  realm?: string[];
  client?: {
    [key: string]: string[];
  };
  application?: {
    [key: string]: string[];
  };
}

export interface KeycloakRoleRepresentation extends ProviderRoleDetails {
  id?: string;
  name?: string;
  description?: string;
  scopeParamRequired?: boolean;
  composite?: boolean;
  composites?: KeycloakRoleComposites;
  clientRole?: boolean;
  containerId?: string;
  attributes?: {
    [key: string]: string[];
  };
}

export interface RoleArgs<T extends ProviderRoleDetails = KeycloakRoleRepresentation> extends BaseEntityArgs {
  authProviderId?: string;
  providerDetails?: T;
}

export default class Role<T extends ProviderRoleDetails = KeycloakRoleRepresentation> extends BaseEntity {
  authProviderId?: string;
  providerDetails?: T;

  constructor({ id, created, modified, authProviderId, providerDetails }: RoleArgs<T>) {
    super({ id, created, modified });

    this.authProviderId = authProviderId;
    this.providerDetails = providerDetails;
  }
}
