const layerAttributes = `
  id
  clientConfig
  name
  sourceConfig
  type
`;

export const allLayersByIds = `query($ids: [Int]) {
  allLayersByIds(ids: $ids) {
    ${layerAttributes}
  }
}`;

export const allLayers = `query {
  allLayers {
    ${layerAttributes}
  }
}`;
