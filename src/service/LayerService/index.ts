import Layer from '../../model/Layer';
import GenericService, { GenericServiceOpts } from '../GenericService';

export class LayerService<T extends Layer> extends GenericService<T> {

  constructor(opts: GenericServiceOpts = {
    basePath: '/layers'
  }) {
    super(opts);
  }

}

export default LayerService;
