import GenericService, { GenericServiceOpts } from '../GenericService';

import Application from '../../model/Application';

export class ApplicationService extends GenericService<Application> {

  constructor(opts: GenericServiceOpts = {
    basePath: '/applications'
  }) {
    super(Application, opts);
  }

}

export default ApplicationService;
