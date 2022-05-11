import { DataSource } from 'apollo-datasource';
import type { Foo } from '../__generated__/resolvers-types';

export class FooAPI extends DataSource {
  getAllFoo(): [Foo] {
    return foos;
  }
  getFoo(id: string): Foo {
    return foos.find((f) => f.id === id) as Foo;
  }
}

const foos: [Foo] = [{ id: '1', name: 'Foo' }];
