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

Validator functions for common validation strategies.

```shell
yarn add @typescript-entity/validators
```

## Usage

### Verbose Usage

You may prefer to [skip to Simplified Usage](#simplified-usage).

```typescript
import { Entity } from "@typescript-entity/core";
import type { Attr, Attrs, FnValue, InitialAttrs, NormalizerFn, SanitizerFn, ValidatorFn } from "@typescript-entity/core";

// ID is an optional number, must be read-only and must have a validator function defined. Like all
// non-function attributes, it must also have a sanitizer function defined.
type IDConfig = {
  value: number | undefined;
  readOnly: true;
  sanitizer: SanitizerFn<number | undefined>;
  validator: ValidatorFn<number | undefined>;
};

// Name is a string and must have a normalizer function defined.
type NameConfig = {
  value: string;
  sanitizer: SanitizerFn<string>;
  normalizer: NormalizerFn<string>;
};

// Username is a function that returns a string. A sanitizer function is not required since values
// for function attributes cannot be set.
type UsernameConfig = {
  value: FnValue<string>;
};

// Smelly is a boolean and is hidden from JSON representation.
type SmellyConfig = {
  value: boolean;
  hidden: true;
  sanitizer: SanitizerFn<boolean>;
};

type Configs = {
  id: IDConfig;
  name: NameConfig;
  username: UsernameConfig;
  smelly: SmellyConfig;
};

export class Person extends Entity<Configs> implements Attrs<Configs> {

  // The runtime configurations are constructed once and passed to all instances of the Person
  // entity via the Entity constructor. All configuration properties are shared between instances to
  // minimise memory footprint, except values for non-function attributes which are cloned.
  public static readonly CONFIGS: Configs = {
    id: {
      value: undefined, // The values provided in the config are used as default values
      readOnly: true, // Must be readOnly to be compatible with IDConfig
      sanitizer: (value: unknown): number | undefined => Number(value) || undefined,
      validator: (value: number): boolean => value > 0,
    },
    name: {
      value: "", // Name was configured as a required string so can't use undefined here
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
  constructor(attrs: InitialAttrs<Configs> = {}) {
    super(Person.CONFIGS, attrs);
  }

  // Because we declared that Person implements Attrs<Configs> we have opted in to defining getters
  // and setters for each attribute on the entity which makes it easier to interact with instances.
  // Types do not need to be specified since they are inferred from Configs.

  get id(): Attr<Configs, "id"> {
    return this.one("id");
  }

  // IDConfig is a read-only attribute so TypeScript will correctly prevent us from setting it.
  //set id(value: Attr<Configs, "id">) {
  //  this.set("id", value);
  //}

  get name(): Attr<Configs, "name"> {
    return this.one("name");
  }

  set name(value: Attr<Configs, "name">) {
    this.set("name", value);
  }

  get username(): Attr<Configs, "username"> {
    return this.one("username");
  }

  // UsernameConfig is a function attribute so TypeScript will correctly prevent us from setting it.
  //set username(value: Attr<Configs, "username">) {
  //  this.set("username", value);
  //}

  get smelly(): Attr<Configs, "smelly"> {
    return this.one("smelly");
  }

  set smelly(value: Attr<Configs, "smelly">) {
    this.set("smelly", value);
  }

}
```

### Simplified Usage

The [example above](#verbose-usage) is intentionally verbose for instructional purposes. Much of it can be simplified using the optional helper packages...

```typescript
import { booleanConfig, fnConfig, positiveIntegerConfig, stringConfig } from "@typescript-entity/configs";
import type { BooleanConfigFactory, FnConfigFactory, PositiveIntegerConfigFactory, StringConfigFactory } from "@typescript-entity/configs";
import { Entity } from "@typescript-entity/core";
import type { Attr, Attrs, InitialAttrs } from "@typescript-entity/core";
import { trim } from "@typescript-entity/normalizers";

type IDConfig = PositiveIntegerConfigFactory<true, false, true>;
type NameConfig = StringConfigFactory<false, false, false, true>;
type UsernameConfig = FnConfigFactory<string>;
type SmellyConfig = BooleanConfigFactory<false, true>;

type Configs = {
  id: IDConfig;
  name: NameConfig;
  username: UsernameConfig;
  smelly: SmellyConfig;
};

export class Person extends Entity<Configs> implements Attrs<Configs> {

  public static readonly CONFIGS: Configs = {
    id: positiveIntegerConfig(true, false, true),
    name: {
      ...stringConfig(),
      normalizer: trim,
    },
    username: fnConfig(function(this: Person): string { return this.name.toLowerCase(); }),
    smelly: booleanConfig(false, true),
  };

  constructor(attrs: InitialAttrs<Configs> = {}) {
    super(Person.CONFIGS, attrs);
  }

  get id(): Attr<Configs, "id"> {
    return this.one("id");
  }

  get name(): Attr<Configs, "name"> {
    return this.one("name");
  }

  set name(value: Attr<Configs, "name">) {
    this.set("name", value);
  }

  get username(): Attr<Configs, "username"> {
    return this.one("username");
  }

  get smelly(): Attr<Configs, "smelly"> {
    return this.one("smelly");
  }

  set smelly(value: Attr<Configs, "smelly">) {
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

```typescript
const json = '{"id":"123","name":"Jane  ","username":"janerocks","smelly":true}';
const jane = new Person(JSON.parse(json));
console.log(jane.id); // 123 (sanitized from string to number)
console.log(jane.name); // "Jane" (normalized to remove trailing whitespace)
console.log(jane.username); // "jane" (the JSON value was ignored as this is a function attr)
console.log(jane.smelly); // true (the JSON value was allowed even though this is a read-only attr)
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
