# @typescript-entity

Typed entity library with attribute sanitization, normalization and validation.

Provides a low-level implementation of data objects represented as entity classes. Each entity class is assigned a collection of attribute configurations that define the value type (`string`, `number`, custom type, anything...) and other constraints such as `optional`, `immutable` or `hidden` (from JSON representation).

Attribute values can be sanitized from raw/untrusted data (e.g. JSON or user-input) using the `sanitizer` function configured for each attribute, as well as normalized and validated by configuring an optional `normalizer` and `validator` function, respectively.

Callable attributes can also be defined which use a callback to obtain generate and return a typed value.

- [Installation](#installation)
  - [Optional Packages](#optional-packages)
- [Usage](#usage)
  - [Verbose Usage](#verbose-usage)
  - [Simplified Usage](#simplified-usage)
  - [Examples](#examples)
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

These packages can help minimize the code required for declaring common attribute configuration sets. They are entirely optional but you may find them useful.

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

## Usage

```typescript
import { booleanConfig, callableConfig, dateInPastConfig, emailConfig, stringConfig, uuidConfig } from '@typescript-entity/configs';
import type { BooleanConfigFactory, CallableAttrConfigFactory, DateInPastConfigFactory, EmailConfigFactory, StringConfigFactory, UUIDConfigFactory } from '@typescript-entity/configs';
import { entity } from '@typescript-entity/core';
import type { AttrName } from '@typescript-entity/core';
import { isLength } from '@typescript-entity/validators';

type UserAttrConfigSet = {

  // `User.date_of_birth` is a date in the past
  date_of_birth: DateInPastConfigFactory;

  // `User.email` is an email address
  email: EmailConfigFactory;

  // `User.email_domain` is an optional, callable attribute that returns the domain part of
  // `User.email` (string). Since this attribute is optional, the callback may also return `null`.
  email_domain: CallableAttrConfigFactory<string, true>;

  // `User.uuid` is an optional, immutable and hidden UUID v4 attribute
  uuid: UUIDConfigFactory<true, true, true>;

  // `User.username` is a required, mutable, visible string attribute, that does not require a
  // normalizer function but does require a validator function
  username: StringConfigFactory<false, false, false, false, true>;

  // `User.verified` is a required, mutable and hidden boolean attribute
  verified: BooleanConfigFactory<false, false, true>;

};

const config: UserAttrConfigSet = {

  // Use the `dateInPastConfig()` helper to generate the config to match the type defined in UserAttrConfigSet['date_of_birth']
  date_of_birth: dateInPastConfig(),

  // Likewise, use the `emailConfig()` helper to generate the config to match the type defined in UserAttrConfigSet['email']
  email: emailConfig(),

  // Create a function that returns the domain part of `User.email`. Using [`this` parameters](https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters)
  // gives you access to the entity instance. The return value must match the type defined in
  // `UserAttrConfigSet['date_of_birth']` (`string` or `null`).
  email_domain: callableConfig(function(this: User): string | null { return this.email.split('@', 2)[1] || null }),

  // The argument order of helper functions match the argument order of the config typings
  uuid: uuidConfig(true, true, true),

  // `User.username` needs to have a custom validator function defined. This validator ensures the
  // username is at least 5 characters long.
  username: {
    ...stringConfig(),
    validator: (value: string, name: AttrName): boolean => isLength(value, name, { min: 5 }),
  },

  // Once again, arguments provided to helper functions must match the arguments provided to the
  // type definition. All arguments (`optional`, `immutable`, `hidden`, `normalizer`, `validator`)
  // default to `false`.
  verified: booleanConfig(false, false, true),

};

// User constructor for creating new `User` instances (`new User()`), runtime type-checking using
// the `instanceof` operator, etc.
const User = entity(config);

// Instance typing for use within Typescript for type-hinting `(user: User) => {}` arguments, etc.
type User = InstanceType<typeof User>;
```
### Examples

```typescript
const user = new User();

console.log(user.date_of_birth); // 1970-01-01T00:00:00.000Z
// Required date attributes default to Unix epoch

console.log(user.email); // ''
// Required string attributes default to an empty string

console.log(user.email_domain); // null
// Optional callable attributes can return null

console.log(user.verified); // false
// Optional boolean attributes default to false

console.log(JSON.stringify(user)) // {"date_of_birth":"1970-01-01T00:00:00.000Z","email":"","email_domain":null,"username":"","verified":false}
// Hidden attributes (`uuid`) are not exposed in JSON

const anotherUser = new User({
  uuid: 'abc', // Immutable attributes can only be set at instantiation
});

anotherUser.set('uuid', 'bar'); // Throws a `ReadOnlyError`

anotherUser.fill({
  uuid: 'bar', // Throws a `ReadOnlyError`
});
```

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
