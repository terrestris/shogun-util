# SHOGun-Util

Connect to a SHOGun instance with ease.

## Installation

```
npm i @terrestris/shogun-util
```

## Usage

This package contains two core classes:

- `SHOGunAPIClient`: Provides access to the HTTP API endpoints of SHOGun.
- `SHOGunApplicationUtil`: A set of helper functions to parse SHOGun
  entities into JavaScript/OpenLayers instances.

See the following example to get an idea on how the classes can be utilized:

```ts
import Keycloak from 'keycloak-js';

import Map from 'ol/Map';

import SHOGunApplicationUtil from '@terrestris/shogun-util/dist/parser/SHOGunApplicationUtil';
import SHOGunAPIClient from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';

// Create the (optional) Keycloak connector. This is required if bearer token authentication
// is needed inside you project setup only.
const keycloak = new Keycloak({
  url: 'https://localhost/auth',
  realm: 'SHOGunRealm',
  clientId: 'SHOGunClient'
});

// Initialize the keycloak client.
keycloak.init({
  onLoad: 'check-sso'
});

// Create the client to easily connect to a SHOGun instance, e.g. to get an
// application configuration.
const client = new SHOGunAPIClient({
  // The path to SHOGun.
  url: '/api',
  // The (optional) keycloak connector.
  keycloak: keycloak
});

// Create the parser to transform SHOGun entities into OpenLayers instances.
const parser = new SHOGunApplicationUtil({
  client
});

// Get the application with ID 1909.
const application = await client.application().findOne(1909);

// Get the map view.
const view = await parser.parseMapView(application);
// Parse the layers.
const layers = await parser.parseLayerTree(application);

// And build the map.
const map = new Map({
  view,
  layers
});
```

## Development

`npm run watch:buildto` can be used to inject an updated version of `shogun-util` into another project.
The script will also watch for further changes.

```sh
npm run watch:buildto ../shogun-gis-client/node_modules/@terrestris/shogun-util/
```
