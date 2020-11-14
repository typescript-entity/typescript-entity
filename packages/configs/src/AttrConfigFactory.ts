import type { AttrValue, CallableAttrConfig, WritableAttrConfig } from '@typescript-entity/core';

type ArrayType<T extends Array<AttrValue>> = T extends (infer R)[] ? R : never;

type ResolvedValue<V extends AttrValue, Optional extends boolean = false> = (
  Optional extends true
    ? V extends Array<AttrValue>
      ? (ArrayType<V> | null)[]
      : V | null
    : V
);

export type WritableAttrConfigFactory<
  V extends AttrValue,
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = (
  WritableAttrConfig<ResolvedValue<V, Optional>> extends infer C
    ? C extends WritableAttrConfig<ResolvedValue<V, Optional>>
      ? (
        Pick<C, 'value' | 'sanitizer'>
        & (Hidden extends true ? { hidden: true } : { hidden?: false })
        & (Immutable extends true ? { immutable: true } : { immutable?: false })
        & (Normalizer extends true ? Pick<Required<C>, 'normalizer'> : { normalizer?: undefined })
        & (Validator extends true ? Pick<Required<C>, 'validator'> : { validator?: undefined })
      )
      : never
    : never
);

export type CallableAttrConfigFactory<
  V extends AttrValue,
  Optional extends boolean = false,
  Hidden extends boolean = false
> = (
  Pick<CallableAttrConfig<ResolvedValue<V, Optional>>, 'fn'>
  & (Hidden extends true ? { hidden: true } : { hidden?: false })
);
