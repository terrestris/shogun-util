import BaseEntity, { BaseEntityArgs } from './BaseEntity';

export interface ProviderUserDetails {}

export interface KeycloakCredentialRepresentation {
  id?: string;
  type?: string;
  userLabel?: string;
  createdDate?: number;
  secretData?: string;
  credentialData?: string;
  priority?: number;
  value?: string;
  temporary?: boolean;
}

export interface KeycloakFederatedIdentityRepresentation {
  identityProvider?: string;
  userId?: string;
  userName?: string;
}

export interface KeycloakUserConsentRepresentation {
  clientId?: string;
  grantedClientScopes?: string[];
  createdDate?: number;
  lastUpdatedDate?: number;
}

export interface KeycloakSocialLinkRepresentation {
  socialProvider?: string;
  socialUserId?: string;
  socialUsername?: string;
}

export interface KeycloakUserRepresentation extends ProviderUserDetails {
  self?: string;
  id?: string;
  origin?: string;
  createdTimestamp?: number;
  username?: string;
  enabled?: boolean;
  totp?: boolean;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  federationLink?: string;
  serviceAccountClientId?: string;
  attributes?: Record<string, string[]>;
  credentials?: KeycloakCredentialRepresentation[];
  disableableCredentialTypes?: string[];
  requiredActions?: string[];
  federatedIdentities?: KeycloakFederatedIdentityRepresentation[];
  realmRoles?: string[];
  clientRoles?: Record<string, string[]>;
  clientConsents?: KeycloakUserConsentRepresentation[];
  notBefore?: number;
  applicationRoles?: Record<string, string[]>;
  socialLinks?: KeycloakSocialLinkRepresentation[];
  groups?: string[];
  access?: Record<string, boolean>;
}

export interface UserArgs<T extends ProviderUserDetails = KeycloakUserRepresentation> extends BaseEntityArgs {
  authProviderId?: string;
  providerDetails?: T;
  details?: any;
  clientConfig?: any;
}

export default class User<T extends ProviderUserDetails = KeycloakUserRepresentation> extends BaseEntity {
  authProviderId?: string;
  providerDetails?: T;
  details?: any;
  clientConfig?: any;

  constructor({ id, created, modified, details, clientConfig, authProviderId, providerDetails }: UserArgs<T>) {
    super({ id, created, modified });

    this.authProviderId = authProviderId;
    this.providerDetails = providerDetails;
    this.details = details;
    this.clientConfig = clientConfig;
  }
}
