import TextualContent from '../../model/TextualContent';
import {
  GenericEntityService, GenericEntityServiceOpts
} from '../GenericEntityService';


class TextualContentService extends GenericEntityService<TextualContent> {
  constructor(opts: GenericEntityServiceOpts = {
    basePath: '/textualcontents'
  }) {
    super(opts);
  }
}

export default TextualContentService;
