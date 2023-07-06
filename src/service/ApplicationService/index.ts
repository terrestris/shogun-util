import Application from '../../model/Application';
import GenericEntityService, { GenericEntityServiceOpts } from '../GenericEntityService';

export class ApplicationService<T extends Application> extends GenericEntityService<T> {

  constructor(opts: GenericEntityServiceOpts = {
    basePath: '/applications'
  }) {
    super(opts);
  }

}

export default ApplicationService;
