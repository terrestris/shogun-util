import GenericService, { GenericServiceOpts } from '../GenericService';

import Application from '../../model/Application';

export class ApplicationService<T extends Application> extends GenericService<T> {

  constructor(opts: GenericServiceOpts = {
    basePath: '/applications'
  }) {
    super(opts);
  }

}

export default ApplicationService;
