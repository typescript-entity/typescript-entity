import type { StaticConfig, StaticValue } from "@typescript-entity/core";

type ArrayType<T extends Array<StaticValue>> = T extends (infer R)[] ? R : never;

export type ResolvedStaticValue<T extends StaticValue, Optional extends boolean = false> = (
  Optional extends true
    ? T extends Array<StaticValue>
      ? (ArrayType<T> | undefined)[]
      : T | undefined
    : T
);

export type ConfigFactory<
  T extends StaticValue,
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = (
  StaticConfig<ResolvedStaticValue<T, Optional>> extends infer C
  ? C extends StaticConfig<ResolvedStaticValue<T, Optional>>
    ? (
      Pick<C, "value" | "sanitizer">
      & (Hidden extends true ? { hidden: true } : { hidden?: false })
      & (ReadOnly extends true ? { readOnly: true } : { readOnly?: false })
      & (Normalizer extends true ? Pick<Required<C>, "normalizer"> : { normalizer?: undefined })
      & (Validator extends true ? Pick<Required<C>, "validator"> : { validator?: undefined })
    )
    : never
  : never
);
