# [5.6.0](https://github.com/terrestris/shogun-util/compare/v5.5.0...v5.6.0) (2023-06-19)


### Features

* optionally keep client config ([57731de](https://github.com/terrestris/shogun-util/commit/57731deab591d486e51aaafc3804f0d034359704))

# [5.5.0](https://github.com/terrestris/shogun-util/compare/v5.4.1...v5.5.0) (2023-06-02)


### Features

* add searchConfig to layer ([29093ef](https://github.com/terrestris/shogun-util/commit/29093efa4a5c10e6fccdbb408b00788e5c95c501))

## [5.4.1](https://github.com/terrestris/shogun-util/compare/v5.4.0...v5.4.1) (2023-06-02)


### Bug Fixes

* fixes edit form component types ([6c0f020](https://github.com/terrestris/shogun-util/commit/6c0f02022e22b4b3a794d370d29be8fc8623fb86))
* sync edit form component types with backend ([aa1912f](https://github.com/terrestris/shogun-util/commit/aa1912f6d29a0653112c58cc38ca5b3682035479))

# [5.4.0](https://github.com/terrestris/shogun-util/compare/v5.3.2...v5.4.0) (2023-06-01)


### Features

* add models to specify form configurations ([f8c2c92](https://github.com/terrestris/shogun-util/commit/f8c2c9241d1de19cb4cf3c68adb48031032ddb71))
* adds editable flag to layer ([484457c](https://github.com/terrestris/shogun-util/commit/484457c545f07c2525ce2b02988bb73320490937))

## [5.3.2](https://github.com/terrestris/shogun-util/compare/v5.3.1...v5.3.2) (2023-05-08)


### Bug Fixes

* only fetch layers with layerId ([1f708b4](https://github.com/terrestris/shogun-util/commit/1f708b40b799f30d8178afd0e1d6a4d14a15411b))

## [5.3.1](https://github.com/terrestris/shogun-util/compare/v5.3.0...v5.3.1) (2023-05-03)


### Bug Fixes

* only use tile load function if necessary ([e0a998d](https://github.com/terrestris/shogun-util/commit/e0a998d43f124221cdc5c4c974fd814a98f2da82))

# [5.3.0](https://github.com/terrestris/shogun-util/compare/v5.2.0...v5.3.0) (2023-04-28)


### Features

* add defaultLangauge type to clientconfig ([6a8117e](https://github.com/terrestris/shogun-util/commit/6a8117e7cc2bca3fc4baae9a14656fa335c60f63))

# [5.2.0](https://github.com/terrestris/shogun-util/compare/v5.1.0...v5.2.0) (2023-04-06)


### Features

* register possibly configured additional crs definitions on client ([279fe56](https://github.com/terrestris/shogun-util/commit/279fe56f705b3fae1258c8bc13223371da034c01))

# [5.1.0](https://github.com/terrestris/shogun-util/compare/v5.0.0...v5.1.0) (2023-01-20)


### Features

* add support for legal information link config ([6f6f032](https://github.com/terrestris/shogun-util/commit/6f6f032d64a5a85ebbc401480fecfa90ec921c0e))

# [5.0.0](https://github.com/terrestris/shogun-util/compare/v4.2.1...v5.0.0) (2023-01-04)


### Features

* add support for OpenAPI version 3 ([1641a53](https://github.com/terrestris/shogun-util/commit/1641a538581b5ce3a041451a8d831c73748381ef))


### BREAKING CHANGES

* removed SwaggerDocs type and added version argument to getApiDocs()

## [4.2.1](https://github.com/terrestris/shogun-util/compare/v4.2.0...v4.2.1) (2022-12-13)


### Bug Fixes

* sets legend url on source for wmts ([8331233](https://github.com/terrestris/shogun-util/commit/83312339f65a5fe0b1d78e2afe49a6c905beb662))

# [4.2.0](https://github.com/terrestris/shogun-util/compare/v4.1.4...v4.2.0) (2022-12-12)


### Bug Fixes

* sets the legendUrl on layer ([6f1743c](https://github.com/terrestris/shogun-util/commit/6f1743cce8df1dcd8b99fe1013bd40643b88ef20))


### Features

* set legendUrl for wmts layers ([a5d6a79](https://github.com/terrestris/shogun-util/commit/a5d6a7990989f216b6208eef1c4abca450deeb47))

## [4.1.4](https://github.com/terrestris/shogun-util/compare/v4.1.3...v4.1.4) (2022-12-08)


### Bug Fixes

* revert no-cors flag ([8a3496c](https://github.com/terrestris/shogun-util/commit/8a3496cd410c6ea6e288272eeb995612d80fd3d4))

## [4.1.3](https://github.com/terrestris/shogun-util/compare/v4.1.2...v4.1.3) (2022-12-07)


### Bug Fixes

* remove no-cors mode, otherwise authentication token won't be sent ([4989445](https://github.com/terrestris/shogun-util/commit/498944571dc2751507f5a26992b59f145443784a))

## [4.1.2](https://github.com/terrestris/shogun-util/compare/v4.1.1...v4.1.2) (2022-12-06)


### Bug Fixes

* use no-cors mode when requesting images ([3c0e9c8](https://github.com/terrestris/shogun-util/commit/3c0e9c8bfbf76c3f00c771e63843d69e84aa274c))

## [4.1.1](https://github.com/terrestris/shogun-util/compare/v4.1.0...v4.1.1) (2022-12-01)


### Bug Fixes

* revoke object urls when reloading tiles ([a827481](https://github.com/terrestris/shogun-util/commit/a827481f1ec029e44568c6a3a40bc16d02cdf8e7))

# [4.1.0](https://github.com/terrestris/shogun-util/compare/v4.0.0...v4.1.0) (2022-11-28)


### Features

* add support for layer type WMSTime ([a4a2a72](https://github.com/terrestris/shogun-util/commit/a4a2a726ea722cc3a93bacb4bea858822aff1a6b))

# [4.0.0](https://github.com/terrestris/shogun-util/compare/v3.7.0...v4.0.0) (2022-11-21)


### Bug Fixes

* fix typing after ol and ol-util upgrade ([21ff5c4](https://github.com/terrestris/shogun-util/commit/21ff5c433788943a7cfdf39f2a007992d518354d))
* get rid of unnecessary quotes ([91a4e86](https://github.com/terrestris/shogun-util/commit/91a4e8654c945d5a9e0fccd71d12c00456c10cf8))


### chore

* upgrade dependencies ([f354aeb](https://github.com/terrestris/shogun-util/commit/f354aebce6e6fa48e96cad27f0ecb7368b261b2e))


### BREAKING CHANGES

* Upgrade to ol v7.x

# [3.7.0](https://github.com/terrestris/shogun-util/compare/v3.6.0...v3.7.0) (2022-10-14)


### Bug Fixes

* make formatName optional ([3129608](https://github.com/terrestris/shogun-util/commit/31296082b5cafc0069dfd3a14a8cdff0bd712fed))


### Features

* add downloadConfig to layer ([2105f5d](https://github.com/terrestris/shogun-util/commit/2105f5dfa0f4d96f0411b4ed7d3e66a5aad9662d))

# [3.6.0](https://github.com/terrestris/shogun-util/compare/v3.5.0...v3.6.0) (2022-09-23)


### Features

* release ([e17f68b](https://github.com/terrestris/shogun-util/commit/e17f68b244df153fe41e4516ff685f133fcfe25f))

# [3.5.0](https://github.com/terrestris/shogun-util/compare/v3.4.1...v3.5.0) (2022-09-01)


### Bug Fixes

* apply newly introduced field layerId ([132dbd0](https://github.com/terrestris/shogun-util/commit/132dbd0e0dbb2a31d4416ef2425950d758315e5a))
* set correct type for layerConfig ([84514e0](https://github.com/terrestris/shogun-util/commit/84514e0389d8b3aada19c4ba9275c3c84f04064a))


### Features

* apply application specific layer configurations if set ([d4c1df7](https://github.com/terrestris/shogun-util/commit/d4c1df78c5bf2db8dac961ef5a9984c8635d2ffd))

## [3.4.1](https://github.com/terrestris/shogun-util/compare/v3.4.0...v3.4.1) (2022-08-15)


### Bug Fixes

* fix init of proj4 definitions ([7b57292](https://github.com/terrestris/shogun-util/commit/7b57292369100292a38b567842f7d616678c796a))

# [3.4.0](https://github.com/terrestris/shogun-util/compare/v3.3.0...v3.4.0) (2022-08-12)


### Features

* enhance parsing of wmts layers: provide matrixSet name and compute matrix sizes manually ([fc8709f](https://github.com/terrestris/shogun-util/commit/fc8709fe3a217c9cbc55970af9f4428ae74150bc))

# [3.3.0](https://github.com/terrestris/shogun-util/compare/v3.2.2...v3.3.0) (2022-08-09)


### Bug Fixes

* provide a default type for the group provider details ([f6d3c67](https://github.com/terrestris/shogun-util/commit/f6d3c6747e38a40baa75d93426e82ba1aab7b940))


### Features

* initialize the PermissionService ([3e60913](https://github.com/terrestris/shogun-util/commit/3e60913de057a792c67693443f90d81055c9274a))

## [3.2.2](https://github.com/terrestris/shogun-util/compare/v3.2.1...v3.2.2) (2022-08-02)


### Bug Fixes

* set useBearerToken as property of the layer ([d2c1033](https://github.com/terrestris/shogun-util/commit/d2c10334c10eccaa74bec9d2ded66b972d468cbf))

## [3.2.1](https://github.com/terrestris/shogun-util/compare/v3.2.0...v3.2.1) (2022-08-01)


### Bug Fixes

* set toolConfig to an array ([6fe532a](https://github.com/terrestris/shogun-util/commit/6fe532ac5d9d7570124f35e98d305db61a2a7844))

# [3.2.0](https://github.com/terrestris/shogun-util/compare/v3.1.3...v3.2.0) (2022-08-01)


### Features

* add husky commintlint ([e607936](https://github.com/terrestris/shogun-util/commit/e6079362015f7d70daff6c27d88dcbf4930ec8a6))

## [3.1.3](https://github.com/terrestris/shogun-util/compare/v3.1.2...v3.1.3) (2022-07-08)


### Bug Fixes

* set correct scope ([53bd6e8](https://github.com/terrestris/shogun-util/commit/53bd6e8ac876b2eeeda7636a21fab7786ee92624))

## [3.1.2](https://github.com/terrestris/shogun-util/compare/v3.1.1...v3.1.2) (2022-07-01)


### Bug Fixes

* allows custom request params ([f1bebd0](https://github.com/terrestris/shogun-util/commit/f1bebd0b40ac39c0967fd508ead9553b68090aaa))

## [3.1.1](https://github.com/terrestris/shogun-util/compare/v3.1.0...v3.1.1) (2022-07-01)


### Bug Fixes

* move transparent param to requestParam map ([f9d18f8](https://github.com/terrestris/shogun-util/commit/f9d18f8d03a69ab62aa7901f2465c68bddeeaff9))

# [3.1.0](https://github.com/terrestris/shogun-util/compare/v3.0.0...v3.1.0) (2022-06-30)


### Features

* configurable transparent parameter ([66a97d8](https://github.com/terrestris/shogun-util/commit/66a97d8b6d4e55176c7ae50c957c876ecea742f7))

# [3.0.0](https://github.com/terrestris/shogun-util/compare/v2.0.0...v3.0.0) (2022-06-28)


### Bug Fixes

* add missing semicolon ([4b64c03](https://github.com/terrestris/shogun-util/commit/4b64c03a5915fc8a8e55fa2e678c8474a4899626))
* fix test ([916e397](https://github.com/terrestris/shogun-util/commit/916e397d09c2adf99190da03e9c3f324290dd409))
* fix typing ([8fee58f](https://github.com/terrestris/shogun-util/commit/8fee58ffed8baa04efadc35f637fb22a6ef05c67))
* rename variable ([f241206](https://github.com/terrestris/shogun-util/commit/f241206d54391bd1073aca9f089ca727a7ce2569))


### Features

* add test for getLayerIds method ([309f38f](https://github.com/terrestris/shogun-util/commit/309f38f3e7cfbbe099d2a2430a1061e306e740af))
* request application layers in bundle ([715caad](https://github.com/terrestris/shogun-util/commit/715caad708260be3dda25e38eeb299a00be4d79e))
* return data from response ([8c02fe2](https://github.com/terrestris/shogun-util/commit/8c02fe2082829d8f5745a3d936dc0af96c47db0f))


### BREAKING CHANGES

* Methods `parseNodes` and `parseFolder` are expecting a mandatory array of layer entities as second argument
* Changes return value of `sendQuery` method from `Promise<GraphQlResponse<T>> to `Promise<[key: string]: T[]>

# [2.0.0](https://github.com/terrestris/shogun-util/compare/v1.2.1...v2.0.0) (2022-06-24)


### Bug Fixes

* set KeycloakGroupRepresentation as default type argument ([ddd07dd](https://github.com/terrestris/shogun-util/commit/ddd07ddb6f1539a138fcaf3d1eff600c361b1e99))


### Styles

* rename ShogunApplicationUtil to SHOGunApplicationUtil ([d3ece9c](https://github.com/terrestris/shogun-util/commit/d3ece9c1a465916fd959a33e4012b86befba565d))
* rename SHOGunClient to SHOGunAPIClient and cache services after first creation ([6fb1b0b](https://github.com/terrestris/shogun-util/commit/6fb1b0b877920ee9e5e071de34d77da97e0eab03))


### BREAKING CHANGES

* Renames ShogunApplicationUtil to SHOGunApplicationUtil
* Renames the SHOGunClient to SHOGunAPIClient

## [1.2.1](https://github.com/terrestris/shogun-util/compare/v1.2.0...v1.2.1) (2022-06-22)


### Bug Fixes

* delete operation do not return any content ([9d2edf1](https://github.com/terrestris/shogun-util/commit/9d2edf1aa11caece4367fe5b7648415fb411e826))

# [1.2.0](https://github.com/terrestris/shogun-util/compare/v1.1.0...v1.2.0) (2022-06-22)


### Bug Fixes

* remove obsolute window namespace ([ff0726b](https://github.com/terrestris/shogun-util/commit/ff0726bfb35d2f194d5223d5cec19d2a70c49573))


### Features

* add getBearerTokenHeader util ([0930303](https://github.com/terrestris/shogun-util/commit/0930303457133bc2af168d302e49d6c3fe419c12))
* Add OpenAPIService ([f7b6e5f](https://github.com/terrestris/shogun-util/commit/f7b6e5f257fd987d01ececa67f3893879b67b0ec))
* applies the keycloak access token to each request ([1fba0a7](https://github.com/terrestris/shogun-util/commit/1fba0a7dd73e35754dff265aecbbfadc85fce7e9))
* send bearer token for WMS Image, ImageTile and WFS (same-origin) requests ([c534377](https://github.com/terrestris/shogun-util/commit/c53437727e8e04ba022b585bf71d2934095129b5))

# [1.1.0](https://github.com/terrestris/shogun-util/compare/v1.0.1...v1.1.0) (2022-06-20)


### Bug Fixes

* cleanup tests ([641f687](https://github.com/terrestris/shogun-util/commit/641f6876981e456b19153df0fe5e42b88b75b479))
* fix line length ([ce8ade9](https://github.com/terrestris/shogun-util/commit/ce8ade99739c92fad5ece82f4b02d2ae0b357083))
* Harmonize services signatures ([749b731](https://github.com/terrestris/shogun-util/commit/749b73143f09db7ee3fd05cb0e443dc0423a0f8b))
* update test ([010eecf](https://github.com/terrestris/shogun-util/commit/010eecf4f44fe24750cee17969515518764792b6))


### Features

* Add CacheService ([208de8f](https://github.com/terrestris/shogun-util/commit/208de8fc9572535fde734d1c05a62d35a488a7ca))
* Add DefaultApplicationTheme and make description optional ([893bdd3](https://github.com/terrestris/shogun-util/commit/893bdd31c52d65496e6ef8cf29f085393ba53c4a))
* Add GroupService and update User model to match current state of SHOGun, it accepts the authentication provider details as generic type now ([0fd7a21](https://github.com/terrestris/shogun-util/commit/0fd7a21a77ace3d3aa0946aa48df3feb078fd1c4))
* add services for File and ImageFile models ([b7417c4](https://github.com/terrestris/shogun-util/commit/b7417c49c7cf23f59fdc11b260c6caf90a7866c9))
* add support for WFS layers in parser ([720b38b](https://github.com/terrestris/shogun-util/commit/720b38be93c79baa40d4fd3bf7f540e6802e16ae))

## [1.0.1](https://github.com/terrestris/shogun-util/compare/v1.0.0...v1.0.1) (2022-05-02)


### Bug Fixes

* Update README ([c51fa1d](https://github.com/terrestris/shogun-util/commit/c51fa1d488c18eef0d872cee73a2b9940b3726c6))
