import { Value, ValueConfig, ValueFn, ValueFnConfig } from '@typescript-entity/core';

export type ConfigFactory<
  V extends Value | ValueFn,
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  EffectiveValue = Optional extends true
    ? V extends ValueFn
      ? NonNullable<ReturnType<V>> | undefined
      : NonNullable<V> | undefined
    : V extends ValueFn
      ? NonNullable<ReturnType<V>>
      : NonNullable<V>,
  C = V extends ValueFn ? ValueFnConfig<EffectiveValue> : ValueConfig<EffectiveValue>
> = (
  (Hidden extends true ? { hidden: true } : { hidden?: false })
  & C extends ValueFnConfig
    ? Omit<C, 'hidden'>
    : (
      Omit<C, 'hidden' | 'readOnly'>
      & (ReadOnly extends true ? { readOnly: true } : { readOnly?: false })
    )
);

export type BooleanConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<boolean, Optional, Hidden, ReadOnly>;

export type BooleanArrayConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<boolean[], Optional, Hidden, ReadOnly>;

export type DateConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<Date, Optional, Hidden, ReadOnly>;

export type DateArrayConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<Date[], Optional, Hidden, ReadOnly>;

export type FnConfig<V extends Value, Optional extends boolean = false, Hidden extends boolean = false> = ConfigFactory<ValueFn<V>, Optional, Hidden>;

export type NumberConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<number, Optional, Hidden, ReadOnly>;

export type NumberArrayConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<number[], Optional, Hidden, ReadOnly>;

export type StringConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<string, Optional, Hidden, ReadOnly>;

export type StringArrayConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<string[], Optional, Hidden, ReadOnly>;
