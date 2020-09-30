import { ValueConfig, ValueFn, ValueFnConfig } from '@typescript-entity/core';

export type ConfigFactory<
  Type,
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  T = Optional extends true
    ? Type extends ValueFn
      ? NonNullable<ReturnType<Type>> | undefined
      : NonNullable<Type> | undefined
    : Type extends ValueFn
      ? NonNullable<ReturnType<Type>>
      : NonNullable<Type>,
  C = Type extends ValueFn ? ValueFnConfig<T> : ValueConfig<T>
> = (
  (
    C extends ValueFnConfig
      ? Omit<C, 'hidden'>
      : (
        Omit<C, 'hidden' | 'readOnly'>
        & (ReadOnly extends true ? { readOnly: true } : { readOnly?: false })
      )
  )
  & (Hidden extends true ? { hidden: true } : { hidden?: false })
);

export type BooleanConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<boolean, Optional, Hidden, ReadOnly>;

export type BooleanArrayConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<boolean[], Optional, Hidden, ReadOnly>;

export type DateConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<Date, Optional, Hidden, ReadOnly>;

export type DateArrayConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<Date[], Optional, Hidden, ReadOnly>;

export type FnConfig<Type, Optional extends boolean = false, Hidden extends boolean = false> = ConfigFactory<() => Type, Optional, Hidden>;

export type NumberConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<number, Optional, Hidden, ReadOnly>;

export type NumberArrayConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<number[], Optional, Hidden, ReadOnly>;

export type StringConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<string, Optional, Hidden, ReadOnly>;

export type StringArrayConfig<Optional extends boolean = false, Hidden extends boolean = false, ReadOnly extends boolean = false> = ConfigFactory<string[], Optional, Hidden, ReadOnly>;
