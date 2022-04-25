import LayerService from '.';
import Layer from '../../model/Layer';
import GenericService from '../GenericService';

describe('LayerService', () => {
  let service: LayerService<Layer>;

  beforeEach(() => {
    service = new LayerService<Layer>();
  });

  it('is is defined', () => {
    expect(LayerService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericService).toBeTruthy();
  });

});
