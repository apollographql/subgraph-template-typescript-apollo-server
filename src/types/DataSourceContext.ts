import type { LocationsAPI } from '../datasources/LocationsAPI';

export interface DataSourceContext {
  dataSources: {
    LocationsAPI: LocationsAPI;
  };
}
