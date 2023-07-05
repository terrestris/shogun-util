import Layer from '../../model/Layer';
import GenericEntityService, { GenericEntityServiceOpts } from '../GenericEntityService';

export class LayerService<T extends Layer> extends GenericEntityService<T> {

  constructor(opts: GenericEntityServiceOpts = {
    basePath: '/layers'
  }) {
    super(opts);
  }

}

export default LayerService;
