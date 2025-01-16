import Application from '../../model/Application';
import { getBearerTokenHeader } from '../../security/getBearerTokenHeader';
import GenericEntityService, { GenericEntityServiceOpts } from '../GenericEntityService';

export class ApplicationService<T extends Application> extends GenericEntityService<T> {

  constructor(opts: GenericEntityServiceOpts = {
    basePath: '/applications'
  }) {
    super(opts);
  }

  async findOneByName(name: string, fetchOpts?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.basePath}/findByName/${name}`, {
        method: 'GET',
        headers: {
          ...getBearerTokenHeader(this.keycloak)
        },
        ...fetchOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error while requesting a single entity: ${error}`);
    }
  }

}

export default ApplicationService;
