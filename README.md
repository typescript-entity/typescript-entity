# @typescript-entity

Typed entity library with attribute sanitization, normalization and validation.

Provides a low-level implementation of data objects represented as entity classes. Each entity class is assigned a collection of attribute configurations that define the value type (`string`, `number`, custom type, anything...) and other constraints such as `optional`, `readOnly` or `hidden` (from JSON representation).

Attribute values can be sanitized from raw/untrusted data (e.g. JSON or user-input) using the `sanitizer` function configured for each attribute, as well as normalized and validated by configuring an optional `normalizer` and `validator` function, respectively. Dynamic attributes can also be defined using functions which also return strictly-typed values.

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

These packages can help minimize the code required for declaring common attribute configurations. They are entirely optional but you may find them useful.

##### [`@typescript-entity/configs`](https://www.npmjs.com/package/@typescript-entity/configs)

Configuration typings and factory functions for common types of attributes.

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

Validators functions for common validation strategies.

```shell
yarn add @typescript-entity/validators
```

## Usage

### Verbose Usage

You may prefer to [skip to Simplified Usage](#simplified-usage).

```typescript
import { Attrs, BooleanConfigFactory, Entity, FnConfigFactory, NumberConfigFactory, StringConfigFactory, WritableAttrs } from "@typescript-entity/core";

// ID is a number and is optional, read-only and must have a validator function defined
type IDConfig = NumberConfigFactory<true, false, true, false, true>;

// Name is a string and is required and must have a normalizer function defined
type NameConfig = StringConfigFactory<false, false, false, true>;

// Username is a string which is simply the lowercase form of Name
type UsernameConfig = FnConfigFactory<string>;

// Smelly is a boolean and is required but hidden
type SmellyConfig = BooleanConfigFactory<false, true>;

type PersonConfigs = {
  id: IDConfig;
  name: NameConfig;
  username: UsernameConfig;
  smelly: SmellyConfig;
};

class Person extends Entity<PersonConfigs> implements Attrs<PersonConfigs> {

  // The runtime configurations are configured statically to maximize reusability but minimize the
  // memory footprint. They don't have be defined here, you may want to define them in a different
  // file - just remember to update the first argument passed to the Entity constructor.
  public static readonly CONFIGS: PersonConfigs = {
    id: {
      value: undefined, // The values provided in the config are used as default values
      readOnly: true,
      sanitizer: (value: unknown): number | undefined => Number(value) || undefined,
      validator: (value: number): boolean => value > 0,
    },
    name: {
      value: "",
      sanitizer: (value: unknown): string => String(value),
      normalizer: (value: string): string => value.trim(),
    },
    username: {
      // All value, sanitizer, normalizer and validator functions have the instance bound to this.
      // Use TypeScript's "this parameters" feature to declare it.
      value: function(this: Person): string { return this.name.toLowerCase(); },
    },
    smelly: {
      value: false,
      hidden: true,
      sanitizer: (value: unknown): boolean => Boolean(value),
    },
  };

  // Allow consumers to provide some/all attributes during construction to override the default
  // values provided in the configs. Attributes passed to the constructor can include values for
  // read-only values but not for function attributes.
  constructor(attrs: Partial<WritableAttrs<PersonConfigs, true>> = {}) {
    super(Person.CONFIGS, attrs);
  }

  // Because we declared that Person implements Attrs<PersonConfigs> we have opted in to defining
  // getters and setters for each attribute on the entity which makes it easier to interact with
  // instances. Types do not need to be specified since they are inferred from PersonConfigs.

  get id() {
    return this.get("id");
  }

  // Since ID is read-only, TypeScript will correctly prevent us from setting it.
  //set id(value) {
  //  this.set("id", value);
  //}

  get name() {
    return this.get("name");
  }

  set name(value) {
    this.set("name", value);
  }

  get username() {
    return this.get("username");
  }

  // Since Username is a function, TypeScript will correctly prevent us from setting it.
  //set username(value) {
  //  this.set("username", value);
  //}

  get smelly() {
    return this.get("smelly");
  }

  set smelly(value) {
    this.set("smelly", value);
  }

}
```

### Simplified Usage

The [example above](#verbose-usage) is intentionally verbose for instructional purposes. Much of it can be simplified using the optional helper packages....

```typescript
import { booleanConfig, positiveIntegerConfig, PositiveIntegerConfigFactory, stringConfig } from "@typescript-entity/configs";
import { Attrs, BooleanConfigFactory, Entity, FnConfigFactory, StringConfigFactory, WritableAttrs } from "@typescript-entity/core";
import { trim } from "@typescript-entity/normalizers";

type PersonConfigs = {
  id: PositiveIntegerConfigFactory<true, false, true>;
  name: StringConfigFactory<false, false, false, true>;
  username: FnConfigFactory<string>;
  smelly: BooleanConfigFactory<false, true>;
};

class Person extends Entity<PersonConfigs> implements Attrs<PersonConfigs> {

  public static readonly CONFIGS: PersonConfigs = {
    id: positiveIntegerConfig(true, false, true),
    name: {
      ...stringConfig(),
      normalizer: trim,
    },
    username: {
      value: function(this: Person): string { return this.name.toLowerCase(); },
    },
    smelly: booleanConfig(false, true),
  };

  constructor(attrs: Partial<WritableAttrs<PersonConfigs, true>> = {}) {
    super(Person.CONFIGS, attrs);
  }

  get id() {
    return this.get("id");
  }

  get name() {
    return this.get("name");
  }

  set name(value) {
    this.set("name", value);
  }

  get username() {
    return this.get("username");
  }

  get smelly() {
    return this.get("smelly");
  }

  set smelly(value) {
    this.set("smelly", value);
  }

}
```

### Examples

```typescript
const person = new Person();
console.log(person.id); // 0
console.log(person.name); // ""
console.log(person.username); // ""
console.log(person.smelly); // false
console.log(JSON.stringify(person)); // {"name":"","username":""}
```

```typescript
const bob = new Person({
  id: 123,
  name: "  Bob  ",
  smelly: true,
});
console.log(bob.id); // 123
console.log(bob.name); // "Bob"
console.log(bob.username); // "bob"
console.log(bob.smelly); // true
console.log(JSON.stringify(bob)); // {"id":123,"name":"Bob","username":"bob"}
```

## API Documentation

Can be found [here](https://apancutt.github.io/typescript-entity/).

## Contributing

This monorepo contains the official `@typescript-entity` packages. It is configured for use with [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) and [Lerna](https://lerna.js.org/). Linting is provided by [`eslint`](https://eslint.org/) using [`@typescript-eslint/eslint-plugin`](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) according to the [`@typescript-eslint/recommended`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/eslint-recommended.ts) rules. Tests run on [`jest`](https://jestjs.io/) using [`ts-jest`](https://www.npmjs.com/package/ts-jest). API documentation is generated using [TypeDoc](https://typedoc.org/).

### Running Tests

Tests reside in [`./tests`](https://github.com/apancutt/typescript-entity/tree/master/tests) and provide unit testing across all packages.

```shell
yarn run test
```

### Running Build

Building will lint, compile, test and regenerate API documentation (in that order).

```shell
yarn run build
```
