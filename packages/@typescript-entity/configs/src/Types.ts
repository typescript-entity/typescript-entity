import type { DateConfigFactory, NumberConfigFactory, StringConfigFactory } from "@typescript-entity/core";

export type DateInFutureConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = DateConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export type DateInPastConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = DateConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export type EmailConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = StringConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export type FloatConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = NumberConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export type IntegerConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = NumberConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export type NegativeFloatConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = NumberConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export type NegativeIntegerConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = NumberConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export type PositiveFloatConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = NumberConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export type PositiveIntegerConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = NumberConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export type URLConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = StringConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export type UUIDConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = StringConfigFactory<Optional, Hidden, ReadOnly, true, true>;
