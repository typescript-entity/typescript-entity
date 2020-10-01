import { Value, ValueConfig, ValueFn, ValueFnConfig } from '@typescript-entity/core';

export type ConfigFactory<
  V extends Value | ValueFn,
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false,
  EffectiveValue = Optional extends true
    ? V extends ValueFn
      ? NonNullable<ReturnType<V>> | undefined
      : NonNullable<V> | undefined
    : V extends ValueFn
      ? NonNullable<ReturnType<V>>
      : NonNullable<V>,
  C extends V extends ValueFn
    ? ValueFnConfig<EffectiveValue>
    : ValueConfig<EffectiveValue>
  = V extends ValueFn
    ? ValueFnConfig<EffectiveValue>
    : ValueConfig<EffectiveValue>
> = (
  (Hidden extends true ? { hidden: true } : { hidden?: false })
  & C extends ValueFnConfig
    ? Omit<C, 'hidden'>
    : (
      Omit<C, 'hidden' | 'readOnly' | 'normalizer' | 'validator'>
      & (ReadOnly extends true ? { readOnly: true } : { readOnly?: false })
      & Pick<Normalizer extends true ? Required<C> : C, 'normalizer'>
      & Pick<Validator extends true ? Required<C> : C, 'validator'>
    )
);

export type BooleanConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = ConfigFactory<boolean, Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type BooleanArrayConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = ConfigFactory<boolean[], Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type DateConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = ConfigFactory<Date, Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type DateArrayConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = ConfigFactory<Date[], Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type FnConfigFactory<
  V extends Value,
  Optional extends boolean = false,
  Hidden extends boolean = false
> = ConfigFactory<ValueFn<V>, Optional, Hidden>;

export type NumberConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = ConfigFactory<number, Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type NumberArrayConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = ConfigFactory<number[], Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type StringConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = ConfigFactory<string, Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type StringArrayConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = ConfigFactory<string[], Optional, Hidden, ReadOnly, Normalizer, Validator>;
