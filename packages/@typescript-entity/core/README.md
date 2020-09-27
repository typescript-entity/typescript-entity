# @typescript-entity/core

Typed entity library with attribute sanitization, normalization and validation.

## Installation

```shell
yarn add @typescript-entity/core
```

## Usage

See the example [User](https://github.com/apancutt/typescript-entity/blob/master/tests/User.ts) entity and the corresponding [test](https://github.com/apancutt/typescript-entity/blob/master/tests/User.test.ts) for usage examples, or take a look at the [API documentation](https://apancutt.github.io/typescript-entity/).

## Motivation

There are various ORM libraries available for Typescript and JavaScript but all are tightly coupled with Data Access Mappers and underlying data stores.

This library provides just the low-level requirements of an entity without the concern of how data is mapped.

The specific use-case that led to it's inception was to be able to share entities between API and client applications. While an API application maps data sourced from arbitrary - and usually multiple - data stores, the client application would map data sourced from the API.

Both applications would share a common package that provides the entity definitions containing common domain and business logic while each being able to implement their own data mapping functionality, either by extending the base entities with `create()`, `update()`, etc. implementations (Active Record pattern) or with dedicated data mapper classes (Data Mapper/Repository pattern).
