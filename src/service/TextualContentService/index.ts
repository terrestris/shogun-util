import TextualContent from '../../model/TextualContent';
import {
  GenericEntityService, GenericEntityServiceOpts
} from '../GenericEntityService';


class TextualContentService<T extends TextualContent> extends GenericEntityService<T> {
  constructor(opts: GenericEntityServiceOpts = {
    basePath: '/textualcontents'
  }) {
    super(opts);
  }
}

export default TextualContentService;
