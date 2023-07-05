import Layer from '../../model/Layer';
import GenericService from '../GenericService';
import LayerService from '.';

describe('LayerService', () => {
  let service: LayerService<Layer>;

  beforeEach(() => {
    service = new LayerService<Layer>();
  });

  it('is defined', () => {
    expect(LayerService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericService).toBeTruthy();
  });

  it('has set the correct default path', () => {
    expect(service.basePath).toEqual('/layers');
  });

});
