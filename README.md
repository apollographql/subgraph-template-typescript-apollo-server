# TypeScript Template

This repo is meant to act as a reasonable foundation for a single NPM package developed in TypeScript. It makes use of a few tools that we've found particularly useful. Below are some notes on how to get started using these tools and ways in which you might want (or need) to configure them.

## Apollo Server 

This template repository contains the necessary boiler plate code for you to develop your Subgraph quickly. All you need to do is drop a schema defined in a `.graphql` file in the **modules** folder and you can run a subgraph locally. There are nice-to-have development aspects around schema modularization and datasource construction defined on folder structures.

### Schema Modules

By default, the `src/modules` folder is where your schema modules should live. A schema modules is defined by a set of type definitions and the associated resolvers (which are optional). The `src/utils/schema.js` file contains a helper function to generate a `GraphQLSchema` from the modules you define in the folder. The modules expect the `.graphql` file and associated resolvers to be named the same (i.e. `locations.graphql` and `locations.js`). 

If you define resolvers, they should export `resolvers` and `typeDefs` like below:

```javascript
export const resolvers = {
  ...
}
export const typeDefs = gql`
type Query {
  helloWolrd: String
}
`
```

If you don't define any resolvers, they will be mocked automatically for you. You can also use a `.graphql` file to define your schema and place the resolvers in a `.ts` file; they just need to be named the same.

There is also the options of appending "*Resolvers*" to the filename if you wanted to define your `typeDefs` in a separate file from where you defined your `resolvers`.

### Schema mocking

By default, when the `process.env.NODE_ENV` is not set to `production`, any schema that doesn't have defined resolvers will be mocked. This code lives in the `src/utils/server.ts` file in the `createSubgraph` helper function. You can provide your own [custom mocks](https://www.graphql-tools.com/docs/mocking#customizing-mocks) to `createSubgraph` or the defaults from `@graphql-tools/mock` will be used. 

### DataSource construction

Apollo Server has a pattern where developers can define `dataSources` that will be available on the `context` in the GraphQL resolvers. In `src/utils/server.ts` there is a helper function `generateDataSources` that takes any datasources defined in `src/datasources` and populates them into the `ApolloServer` instance. Each file should define a single class that is exported like below:

```typescript
import { DataSource } from 'apollo-datasource';
export class LocationsAPI extends DataSource {
  ...
}
```

## Jest

Jest is a testing framework used by most of Apollo's current projects.

To run tests in the repo:
`npm test`

The Jest configuration can be found at `jest.config.ts`. As configured, Jest will run all files named `*.test.ts` found within any `__tests__` folder. This is simply a convention chosen by this repo and can be reconfigured via the `testRegex` configuration option in [`jest.config.ts`](jest.config.ts).

For more information on configuring Jest see the [Jest docs](https://jestjs.io/docs/configuration).

## CodeSandbox CI

> At the time of writing this, CodeSandbox CI only works for public repos.

### Installation

[GitHub app](https://github.com/apps/codesandbox)
> Note: a GitHub _org_ admin must approve app installations. By adding a GitHub app to your repo, you'll be submitting a request for approval. At the time of writing this, the GitHub UI doesn't make this clear.

CodeSandbox CI provides an installable build of your package on every PR. If your package builds successfully, CS:CI will leave a comment on the PR with instructions on how to try out your build in a project. This gives contributors access to their work immediately, allowing them to manually test their builds or even use a fix right away.

CS:CI will also provide links to sandboxes which use your newly built package if you choose. This is configurable via the `sandboxes` field in [`.codesandbox/ci.json`](.codesandbox/ci.json). This field is a list of sandbox IDs which you can find via the CodeSandbox web interface. For example, the Apollo Server repo specifies both JS and TS Apollo Server sandboxes like so: `["apollo-server-typescript-3opde","apollo-server"]`.

> For additional information on configuring CS:CI, [visit the docs](https://codesandbox.io/docs/ci).

## Renovate

### Installation

[GitHub app](https://github.com/apps/renovate)

> Note: a GitHub _org_ admin must approve app installations. By adding a GitHub app to your repo, you'll be submitting a request for approval. At the time of writing this, the GitHub UI doesn't make this clear.

Renovate automates dependency updates. The bot will open and merge PRs with updates to a variety of dependencies (including but not limited to npm dependencies). Renovate is _highly_ configurable via the [renovate.json5](renovate.json5) file. Package restrictions and scheduling are just a couple things that we commonly configure.

If you've configured PRs to require approval (mentioned in [GitHub](#github)), you may want to also install [Renovate's Approve bot](https://github.com/apps/renovate-approve). The approve bot will approve all renovate PRs in order to appease the PR approval requirement.

If you're unfamiliar with Renovate, the docs are really worth perusing even if just to get an idea of what kinds of configuration are possible.

> For additional information on configuring Renovate, [visit the docs](https://docs.renovatebot.com/).

## Prettier

Prettier is an opinionated code formatting tool. 

To check for formatting issues:
`npm run prettier:check`

To auto-fix formatting issues:
`npm run prettier:fix`

This is enforced in CI via the `Prettier` job.

> For additional information on configuring Prettier, [visit the docs](https://prettier.io/docs/en/options).