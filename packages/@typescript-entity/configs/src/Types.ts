import { Value, ValueConfig, ValueFn, ValueFnConfig } from '@typescript-entity/core';

export type Config<
  V extends Value | ValueFn,
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false,
  EffectiveType extends Value = V extends ValueFn ? ReturnType<V> : V,
  EffectiveValue extends Value = Optional extends true ? EffectiveType | undefined : EffectiveType,
  C extends V extends ValueFn
    ? ValueFnConfig<EffectiveValue>
    : ValueConfig<EffectiveValue>
  = V extends ValueFn
    ? ValueFnConfig<EffectiveValue>
    : ValueConfig<EffectiveValue>
> = (
  /* eslint-disable @typescript-eslint/ban-types */
  C
  & (Hidden extends true ? { hidden: true } : {})
  & (
    C extends ValueConfig
      ? (
        (Hidden extends true ? { hidden: true } : {})
        & (ReadOnly extends true ? { readOnly: true } : {})
        & (Normalizer extends true ? Pick<Required<C>, 'normalizer'> : {})
        & (Validator extends true ? Pick<Required<C>, 'validator'> : {})
      )
      : {}
  )
  /* eslint-enable @typescript-eslint/ban-types */
);

export type AsOptional<C extends ValueConfig | ValueFnConfig> = Config<
  C extends ValueFnConfig ? ReturnType<C['value']> : C['value'],
  true,
  C['hidden'] extends true ? true : false,
  C extends ValueConfig ? C['readOnly'] extends true ? true : false : false,
  C extends ValueConfig ? undefined extends C['normalizer'] ? false : true : false,
  C extends ValueConfig ? undefined extends C['validator'] ? false : true : false
>;

export type AsHidden<C extends ValueConfig | ValueFnConfig> = Config<
  C extends ValueFnConfig ? ReturnType<C['value']> : C['value'],
  C extends ValueFnConfig ? undefined extends ReturnType<C['value']> ? true : false : undefined extends C['value'] ? true : false,
  true,
  C extends ValueConfig ? C['readOnly'] extends true ? true : false : false,
  C extends ValueConfig ? undefined extends C['normalizer'] ? false : true : false,
  C extends ValueConfig ? undefined extends C['validator'] ? false : true : false
>;

export type AsReadOnly<C extends ValueConfig> = Config<
  C['value'],
  undefined extends C['value'] ? true : false,
  C['hidden'] extends true ? true : false,
  true,
  undefined extends C['normalizer'] ? false : true,
  undefined extends C['validator'] ? false : true
>;

export type WithNormalizer<C extends ValueConfig> = Config<
  C['value'],
  undefined extends C['value'] ? true : false,
  C['hidden'] extends true ? true : false,
  C['readOnly'] extends true ? true : false,
  true,
  undefined extends C['validator'] ? false : true
>;

export type WithValidator<C extends ValueConfig> = Config<
  C['value'],
  undefined extends C['value'] ? true : false,
  C['hidden'] extends true ? true : false,
  C['readOnly'] extends true ? true : false,
  undefined extends C['normalizer'] ? false : true,
  true
>;

export type BooleanConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = Config<boolean, Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type BooleanArrayConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = Config<boolean[], Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type DateConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = Config<Date, Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type DateArrayConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = Config<Date[], Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type FnConfig<
  V extends Value,
  Optional extends boolean = false,
  Hidden extends boolean = false
> = Config<ValueFn<V>, Optional, Hidden>;

export type NumberConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = Config<number, Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type NumberArrayConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = Config<number[], Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type StringConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = Config<string, Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type StringArrayConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = Config<string[], Optional, Hidden, ReadOnly, Normalizer, Validator>;

export type DateInFutureConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = DateConfig<Optional, Hidden, ReadOnly, false, true>;

export type DateInPastConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = DateConfig<Optional, Hidden, ReadOnly, false, true>;

export type EmailConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = StringConfig<Optional, Hidden, ReadOnly, false, true>;

export type FloatConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = NumberConfig<Optional, Hidden, ReadOnly, false, true>;

export type IntegerConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = NumberConfig<Optional, Hidden, ReadOnly, false, true>;

export type NegativeIntegerConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = IntegerConfig<Optional, Hidden, ReadOnly>;

export type NegativeFloatConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = FloatConfig<Optional, Hidden, ReadOnly>;

export type NegativeNumberConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = NumberConfig<Optional, Hidden, ReadOnly, false, true>;

export type PositiveFloatConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = FloatConfig<Optional, Hidden, ReadOnly>;

export type PositiveIntegerConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = IntegerConfig<Optional, Hidden, ReadOnly>;

export type PositiveNumberConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = NumberConfig<Optional, Hidden, ReadOnly, false, true>;

export type URLConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = StringConfig<Optional, Hidden, ReadOnly, false, true>;

export type UUIDConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = StringConfig<Optional, Hidden, ReadOnly, true, true>;
