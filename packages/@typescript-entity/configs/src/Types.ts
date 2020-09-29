import { Config, Value, ValueFn } from '@typescript-entity/core';

export type ConfigFactoryEffectiveValue<T extends Value | ValueFn, O extends boolean> = (
  T extends ValueFn
    ? T
    : O extends true
      ? NonNullable<T> | undefined
      : NonNullable<T>
);

export type ConfigFactory<
  Type extends Value | ValueFn,
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  V extends ConfigFactoryEffectiveValue<Type, Optional> = ConfigFactoryEffectiveValue<Type, Optional>,
  C extends Config<V> = Config<V>
> = (
  (Hidden extends true ? { hidden: true } : { hidden?: false })
  & (
    V extends ValueFn
      ? Omit<C, 'hidden'>
      : (
        Omit<C, 'hidden' | 'readOnly'>
        & (ReadOnly extends true ? { readOnly: true } : { readOnly?: false })
      )
  )
);

export type BooleanConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<boolean, Optional, Hidden, ReadOnly>;

export type BooleanArrayConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<boolean[], Optional, Hidden, ReadOnly>;

export type DateConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<Date, Optional, Hidden, ReadOnly>;

export type DateArrayConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<Date[], Optional, Hidden, ReadOnly>;

export type FnConfig<Type extends Value> = ConfigFactory<() => Type>;

export type NumberConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<number, Optional, Hidden, ReadOnly>;

export type NumberArrayConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<number[], Optional, Hidden, ReadOnly>;

export type StringConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<string, Optional, Hidden, ReadOnly>;

export type StringArrayConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<string[], Optional, Hidden, ReadOnly>;
