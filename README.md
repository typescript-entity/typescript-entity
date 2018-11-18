# typescript-model

Typed entity modeling library with attribute sanitization and validation.

## Installation

```shell
npm install --save typescript-model
```

## Usage

An example `User` model is shown below.

```typescript
import { Attributes, Model, Config as BaseConfig, Sanitizers, Validators, sanitizers, validators } from 'typescript-model';

export interface Config extends BaseConfig {
  min_username_length: number,
};

export class User extends Model<Config> {

  public email!: string; // Note the use of '!' to silence TS2564 errors; these properties are definitely assigned in super.constructor()
  public id?: number; // A '!' is not required as this parameter is marked as optional ('?')
  public username!: string;
  public verified!: boolean;

  static config: Config = {
    ...Model.config,
    min_username_length: 5,
  };

  static sanitizers: Sanitizers<User> = {
    ...Model.sanitizers,
    email: (model, key, value) => sanitizers.string(value),
    id: (model, key, value) => undefined !== value ? sanitizers.integer(value) : undefined,
    username: (model, key, value) => sanitizers.string(value),
    verified: (model, key, value) => sanitizers.boolean(value),
  };

  static validators: Validators<User> = {
    ...Model.validators,
    email: (model, key, value) => validators.email(value),
    id: (model, key, value) => undefined === value || validators.integer(value, {min: 1}),
    username: (model, key, value) => validators.string(value, {min: model.config.min_username_length}),
    verified: (model, key, value) => validators.boolean(value),
  };

  public constructor(attrs: Attributes<User>, config: Partial<Config> = {}, raw: boolean = false) {
    super(attrs, { ...User.config, ...config as object } as Config, raw);
  }

}
```

Instantiation:

```typescript
import { User } from './User';

const user = new User({ email: 'foo@example.com', username: 'foo', verified: false });

console.log(user); // User { email: 'foo@example.com', username: 'foo', verified: false }
```

 Review the `__tests__` directory for additional usage examples.

## Motivation

There are various ORM libraries available for Typescript and JavaScript but all are tightly coupled with Data Access Mappers and underlying data stores.

This library provides just the low-level requirements of an entity model without the concern of how data is mapped.

The specific use-case that led to it's inception was to be able to share entity models between API and client applications. While an API application maps data sourced from arbitrary - and usually multiple - data stores, the client application would map data sourced from the API.

Both applications would share a common package that provides the model definitions containing common domain and business logic while each being able to implement their own data mapping functionality, either by extending the base entities with `create()`, `update()`, etc. implementations (Active Record pattern) or with dedicated data mapper classes (Repository pattern).
