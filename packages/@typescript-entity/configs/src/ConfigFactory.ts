import type { Config, ResolvedValue, Value } from "@typescript-entity/core";

export type ConfigFactory<
  V extends Value,
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = (
  Config<ResolvedValue<V, Optional>> extends infer C
  ? C extends Config<ResolvedValue<V, Optional>>
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
