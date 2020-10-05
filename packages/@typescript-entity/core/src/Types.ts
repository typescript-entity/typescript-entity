export interface Configs {
  [name: string]: Config | FnConfig;
}

export interface Config<V extends Value = Value> {
  hidden?: boolean;
  normalizer?: NormalizerFn<V>;
  readOnly?: boolean;
  sanitizer: SanitizerFn<V>;
  validator?: ValidatorFn<V>;
  value: V;
}

export interface FnConfig<V extends Value = Value> {
  hidden?: boolean;
  value: ValueFn<V>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Value = any;

export type ValueFn<V extends Value = Value> = () => V;

export type ResolvedValue<V extends Value, Optional extends boolean = false> = (
  Optional extends true
    ? V extends Array<Value>
      ? (ArrayType<V> | undefined)[]
      : V | undefined
    : V
);

export type ArrayType<T extends Array<Value>> = T extends (infer R)[] ? R : never;

export type SanitizerFn<V> = (value: unknown) => V;

export type NormalizerFn<V> = (value: NonNullable<V>) => V;

export type ValidatorFn<V> = (value: NonNullable<V>) => boolean;

export type Attrs<C extends Configs> = {
  [K in keyof C]: Attr<C[K]>;
};

export type Attr<C extends Config | FnConfig> = C extends FnConfig ? ReturnType<C["value"]> : C["value"];

export type Unsanitized<Attrs> = Record<keyof Attrs, unknown>;

export type HiddenAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K]["hidden"] extends true ? K : never;
}[keyof C]>>;

export type VisibleAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K]["hidden"] extends true ? never : K;
}[keyof C]>>;

export type WritableAttrs<C extends Configs, OverrideReadOnly extends boolean = false> = Attrs<Pick<C, {
  [K in keyof C]: C[K] extends Config
    ? C[K]["readOnly"] extends true
      ? OverrideReadOnly extends true
        ? K
        : never
      : K
    : never;
}[keyof C]>>;

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

export type FnConfigFactory<
  V extends Value,
  Optional extends boolean = false,
  Hidden extends boolean = false
> = (
  Pick<FnConfig<ResolvedValue<V, Optional>>, "value">
  & (Hidden extends true ? { hidden: true } : { hidden?: false })
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
