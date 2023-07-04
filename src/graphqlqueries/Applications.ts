export const applicationAttributes = `
  id
  created
  modified
  name
  stateOnly
  clientConfig
  layerTree
  layerConfig
  toolConfig
`;

export const applicationById = `query($id: Int) {
  applicationById(id: $id) {
    ${applicationAttributes}
  }
}`;
