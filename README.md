# typescript-entity

Typed entity library with attribute sanitization and validation.

## Installation

```shell
yarn add typescript-entity
```

## Usage

See the example [User](./__tests__/User.ts) entity and the corresponding [test](./__tests__/User.test.ts) for usage examples.

## Motivation

There are various ORM libraries available for Typescript and JavaScript but all are tightly coupled with Data Access Mappers and underlying data stores.

This library provides just the low-level requirements of an entity without the concern of how data is mapped.

The specific use-case that led to it's inception was to be able to share entities between API and client applications. While an API application maps data sourced from arbitrary - and usually multiple - data stores, the client application would map data sourced from the API.

Both applications would share a common package that provides the entity definitions containing common domain and business logic while each being able to implement their own data mapping functionality, either by extending the base entities with `create()`, `update()`, etc. implementations (Active Record pattern) or with dedicated data mapper classes (Repository pattern).
