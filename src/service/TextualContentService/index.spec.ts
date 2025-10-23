import TextualContent from '../../model/TextualContent';
import GenericEntityService from '../GenericEntityService';
import TextualContentService from '.';

describe('TextualContentService', () => {
  let service: TextualContentService<TextualContent>;

  beforeEach(() => {
    service = new TextualContentService<TextualContent>();
  });

  it('is defined', () => {
    expect(TextualContentService).toBeDefined();
  });

  it('extends the GenericService', () => {
    expect(service instanceof GenericEntityService).toBeTruthy();
  });

  it('has set the correct default path', () => {
    expect(service.getBasePath()).toEqual('/textualcontents');
  });

});
