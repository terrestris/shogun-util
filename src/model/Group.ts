import BaseEntity, { BaseEntityArgs } from './BaseEntity';

export interface ProviderGroupDetails {}

export interface KeycloakGroupRepresentation extends ProviderGroupDetails {
  id?: string;
  name?: string;
  path?: string;
  attributes?: Record<string, string[]>;
  realmRoles?: string[];
  clientRoles?: Record<string, string[]>;
  subGroups?: KeycloakGroupRepresentation[];
  access?: Record<string, boolean>;
}

export interface GroupArgs<T extends ProviderGroupDetails = KeycloakGroupRepresentation> extends BaseEntityArgs {
  authProviderId?: string;
  providerDetails?: T;
}

export default class Group<T extends ProviderGroupDetails = KeycloakGroupRepresentation> extends BaseEntity {
  authProviderId?: string;
  providerDetails?: T;

  constructor({ id, created, modified, authProviderId, providerDetails }: GroupArgs<T>) {
    super({ id, created, modified });

    this.authProviderId = authProviderId;
    this.providerDetails = providerDetails;

  }
}
