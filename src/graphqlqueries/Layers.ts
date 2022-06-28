export const allLayersByIds = `query($ids: [Int]) {
  allLayersByIds(ids: $ids) {
    id
    clientConfig
    name
    sourceConfig
    type
  }
}`;
