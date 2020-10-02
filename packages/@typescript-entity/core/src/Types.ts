export interface Configs {
  [name: string]: Config | FnConfig;
}

export interface Config<V = Value> {
  hidden?: boolean;
  normalizer?: NormalizerFn<V>;
  readOnly?: boolean;
  sanitizer: SanitizerFn<V>;
  validator?: ValidatorFn<V>;
  value: V;
}

export interface FnConfig<V = Value> {
  hidden?: boolean;
  value: ValueFn<V>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Value = any;

export type ValueFn<V = Value> = () => V;

export type SanitizerFn<V> = (value: unknown) => V;

export type NormalizerFn<V> = (value: NonNullable<V>) => V;

export type ValidatorFn<V> = (value: NonNullable<V>) => boolean;

export type Attrs<C extends Configs> = {
  [K in keyof C]: Attr<C[K]>;
};

export type Attr<C extends Config | FnConfig> = C extends FnConfig ? ReturnType<C['value']> : C['value'];

export type Unsanitized<Attrs> = Record<keyof Attrs, unknown>;

export type HiddenAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K]['hidden'] extends true ? K : never;
}[keyof C]>>;

export type VisibleAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K]['hidden'] extends true ? never : K;
}[keyof C]>>;

export type ValueAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K] extends Config ? K : never;
}[keyof C]>>;

export type WritableAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K] extends Config
    ? C[K]['readOnly'] extends true
      ? never
      : K
    : never;
}[keyof C]>>;

export type ConfigFactory<
  V extends Value = Value,
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = (
  Config<Optional extends true ? V | undefined : V>
  & (Hidden extends true ? { hidden: true } : { hidden?: false })
  & (ReadOnly extends true ? { readOnly: true } : { readOnly?: false })
  /* eslint-disable @typescript-eslint/ban-types */
  & (Normalizer extends true ? { normalizer: NormalizerFn<V> } : {})
  & (Validator extends true ? { validator: ValidatorFn<V> } : {})
  /* eslint-enable @typescript-eslint/ban-types */
);

export type FnConfigFactory<
  V extends Value = Value,
  Optional extends boolean = false,
  Hidden extends boolean = false
> = (
  FnConfig<Optional extends true ? V | undefined : V>
  & (Hidden extends true ? { hidden: true } : { hidden?: false })
);

export type BooleanConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = ConfigFactory<boolean, Optional, Hidden, ReadOnly>;

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
