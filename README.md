# @typescript-entity

Typed entity library with attribute sanitization, normalization and validation.

Provides a low-level implementation of data objects represented as entity classes. Each entity class is assigned a collection of attribute configurations that define the value type (`string`, `number`, custom type, anything...) and other constraints such as `optional` (`null` values allowed), `immutable` (read-only) or `hidden` (from JSON representation).

Attribute values can be sanitized from raw/untrusted data (e.g. JSON or user-input) using the `sanitizer` function configured for each attribute, as well as normalized and validated by configuring an optional `normalizer` and `validator` function, respectively.

Callable attributes can also be defined which use a callback to obtain generate and return a typed value.

- [Installation](#installation)
  - [Optional Packages](#optional-packages)
- [Example](#example)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
  - [Running Tests](#running-tests)
  - [Running Build](#running-build)

## Installation

The core functionality is provided by [`@typescript-entity/core`](https://www.npmjs.com/package/@typescript-entity/core).

```shell
yarn add @typescript-entity/core
```

### Optional Packages

These packages help minimize the code required for declaring common attribute configuration sets. They are entirely optional but you may find them useful.

##### [`@typescript-entity/configs`](https://www.npmjs.com/package/@typescript-entity/configs)

Attribute configuration set typings and factory functions for common types of attributes.

```shell
yarn add @typescript-entity/configs
```

##### [`@typescript-entity/normalizers`](https://www.npmjs.com/package/@typescript-entity/normalizers)

Normalizer functions for common normalization strategies.

```shell
yarn add @typescript-entity/normalizers
```

##### [`@typescript-entity/sanitizers`](https://www.npmjs.com/package/@typescript-entity/sanitizers)

Sanitizer functions for common sanitization strategies.

```shell
yarn add @typescript-entity/sanitizers
```

##### [`@typescript-entity/validators`](https://www.npmjs.com/package/@typescript-entity/validators)

Validator functions for common validation strategies.

```shell
yarn add @typescript-entity/validators
```

## Example

![Example](https://github.com/typescript-entity/typescript-entity/raw/master/example.png "Example")

A copy/paste version is available in [example.ts](https://github.com/typescript-entity/typescript-entity/tree/master/example.ts)

## API Documentation

Can be found [here](https://typescript-entity.github.io/typescript-entity/).

## Contributing

This monorepo contains the official `@typescript-entity` packages. It is configured for use with [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) and [Lerna](https://lerna.js.org/). Linting is provided by [`eslint`](https://eslint.org/) using [`@typescript-eslint/eslint-plugin`](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) according to the [`@typescript-eslint/recommended`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/eslint-recommended.ts) rules. Tests run on [`jest`](https://jestjs.io/) using [`ts-jest`](https://www.npmjs.com/package/ts-jest). API documentation is generated using [TypeDoc](https://typedoc.org/).

### Running Tests

Tests reside in [`./tests`](https://github.com/typescript-entity/typescript-entity/tree/master/tests) and provide unit testing across all packages.

```shell
yarn run test
```

### Running Build

Building will lint, compile, test and regenerate API documentation (in that order).

```shell
yarn run build
```
