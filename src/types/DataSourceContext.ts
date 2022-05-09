import type { FooAPI } from '../datasources/FooAPI';
import { Api, Bar } from '../datasources/BarAPI';

export interface DataSourceContext {
  authorization?: string;
  dataSources: {
    FooAPI: FooAPI;
    BarAPI: Api<Bar>;
  };
}
