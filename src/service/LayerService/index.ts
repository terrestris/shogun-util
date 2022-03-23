import GenericService, { GenericServiceOpts } from '../GenericService';

import Layer from '../../model/Layer';

export class LayerService extends GenericService<Layer> {

  constructor(opts: GenericServiceOpts = {
    basePath: '/layers'
  }) {
    super(Layer, opts);
  }

}

export default LayerService;
