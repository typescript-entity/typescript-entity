# typescript-entity

Typed entity library with attribute sanitization and validation.

## Installation

```shell
yarn add typescript-entity
```

## Usage

An example `User` entity is shown below.

```typescript
import { Config as BaseConfig, Entity, Sanitizers, Validators, sanitizers, validators } from 'typescript-entity';

export interface Config extends BaseConfig {
  minUsernameLength: number,
};

export class User extends Entity<Config> {

  public email: string;
  public id?: number;
  public username: string;
  public verified: boolean;

  static config: Config = {
    ...Entity.config,
    minUsernameLength: 5,
  };

  static sanitizers: Sanitizers<User> = {
    ...Entity.sanitizers,
    email: (entity, key, value) => sanitizers.string(value),
    id: (entity, key, value) => undefined !== value ? sanitizers.integer(value) : undefined,
    username: (entity, key, value) => sanitizers.string(value),
    verified: (entity, key, value) => sanitizers.boolean(value),
  };

  static validators: Validators<User> = {
    ...Entity.validators,
    email: (entity, key, value) => validators.email(value),
    id: (entity, key, value) => undefined === value || validators.integer(value, { min: 1 }),
    username: (entity, key, value) => validators.string(value, { min: entity.config.minUsernameLength }),
    verified: (entity, key, value) => validators.boolean(value),
  };

  public constructor(email: string, username: string, verified: boolean = false, config: Partial<Config> = {}) {
    super({ ...User.config, ...config as object } as Config);
    this.email = email;
    this.username = username;
    this.verified = verified;
  }

}
```

Instantiation:

```typescript
import { User } from './User';

const user = new User('foo@example.com', 'foo', false);

console.log(user);

// User { email: 'foo@example.com', username: 'foo', verified: false }
```

 Review the `__tests__` directory for additional usage examples.

## Motivation

There are various ORM libraries available for Typescript and JavaScript but all are tightly coupled with Data Access Mappers and underlying data stores.

This library provides just the low-level requirements of an entity without the concern of how data is mapped.

The specific use-case that led to it's inception was to be able to share entities between API and client applications. While an API application maps data sourced from arbitrary - and usually multiple - data stores, the client application would map data sourced from the API.

Both applications would share a common package that provides the entity definitions containing common domain and business logic while each being able to implement their own data mapping functionality, either by extending the base entities with `create()`, `update()`, etc. implementations (Active Record pattern) or with dedicated data mapper classes (Repository pattern).
