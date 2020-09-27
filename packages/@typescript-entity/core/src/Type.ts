export interface Configs {
  [name: string]: ValueConfig | FnConfig;
}

interface Config {
  hidden?: boolean;
}

export interface ValueConfig<T = Type> extends Config {
  fn?: never;
  normalizer?: NormalizerFn<T>;
  readOnly?: boolean;
  sanitizer: SanitizerFn<T>;
  validator?: ValidatorFn<T>;
  value: T;
}

export interface FnConfig<T = Type> extends Config {
  fn: Fn<T>;
  normalizer?: never;
  readOnly?: never;
  sanitizer?: never;
  validator?: never;
  value?: never;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Type = any;

export type Fn<T = Type> = () => T;

export type SanitizerFn<T = Type> = (value: unknown) => T;

export type NormalizerFn<T = Type> = (value: NonNullable<T>) => T;

export type ValidatorFn<T = Type> = (value: NonNullable<T>) => boolean;

export type Attrs<C extends Configs> = {
  [K in keyof C]: C[K] extends ValueConfig
    ? C[K]['value'] // TODO: Remove? C['value'] extends [boolean] ? boolean : C['value'] // See: https://github.com/microsoft/TypeScript/issues/30029
    : C[K] extends FnConfig ? ReturnType<C[K]['fn']> : never;
};

type HiddenConfigs<C extends Configs> = Pick<C, {
  [K in keyof C]: C[K]['hidden'] extends true ? K : never;
}[keyof C]>;
export type HiddenAttrs<C extends Configs> = Attrs<HiddenConfigs<C>>;

type VisibleConfigs<C extends Configs> = Omit<C, keyof HiddenConfigs<C>>;
export type VisibleAttrs<C extends Configs> = Attrs<VisibleConfigs<C>>;

type ValueConfigs<C extends Configs> = Pick<C, {
  [K in keyof C]: C[K] extends ValueConfig ? K : never;
}[keyof C]>;
export type ValueAttrs<C extends Configs> = Attrs<ValueConfigs<C>>;

type FnConfigs<C extends Configs> = Pick<C, {
  [K in keyof C]: C[K] extends FnConfig ? K : never;
}[keyof C]>;
export type FnAttrs<C extends Configs> = Attrs<FnConfigs<C>>;

type ReadOnlyConfigs<C extends Configs, VC extends ValueConfigs<C> = ValueConfigs<C>> = Pick<VC, {
  [K in keyof VC]: VC[K]['readOnly'] extends true ? K : never
}[keyof VC]>;
export type ReadOnlyAttrs<C extends Configs> = Attrs<ReadOnlyConfigs<C>>;

type WritableConfigs<C extends Configs> = Omit<ValueConfigs<C>, keyof ReadOnlyConfigs<C>>;
export type WritableAttrs<C extends Configs> = Attrs<WritableConfigs<C>>;

export type SanitizableAttrs<C extends Configs> = ValueAttrs<C>;

export type NormalizableAttrs<C extends Configs> = ValueAttrs<C>;

export type ValidatableAttrs<C extends Configs> = ValueAttrs<C>;

export type AsOptional<A extends ValueConfig> = Omit<A, 'value'> & { value: A['value'] | undefined };

export type AsHidden<A extends ValueConfig> = A & { hidden: true };

export type AsReadOnly<A extends ValueConfig> = A & { readOnly: true };

export type WithSanitizer<A extends ValueConfig> = A & Pick<Required<A>, 'sanitizer'>;

export type WithNormalizer<A extends ValueConfig> = A & Pick<Required<A>, 'normalizer'>;

export type WithValidator<A extends ValueConfig> = A & Pick<Required<A>, 'validator'>;

export type UnsanitizedAttrs<C extends Configs, AllowReadOnly extends boolean = false> = Record<keyof (AllowReadOnly extends true ? ValueAttrs<C> : WritableAttrs<C>), unknown>;

export type FillableAttrs<C extends Configs, AllowReadOnly extends boolean = false> = AllowReadOnly extends true ? ValueAttrs<C> : WritableAttrs<C>

export type EntityConstructorAttrs<C extends Configs> = Partial<ValueAttrs<C>>;

export type EntityInterface<C extends Configs> = Attrs<C>;
