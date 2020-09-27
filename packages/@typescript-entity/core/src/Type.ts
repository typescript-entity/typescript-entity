export interface Configs {
  [name: string]: ValueConfig | FnConfig;
}

interface Config {
  hidden?: boolean;
}

export interface ValueConfig<T = Type> extends Config {
  normalizer?: NormalizerFn<T>;
  readOnly?: boolean;
  sanitizer: SanitizerFn<T>;
  validator?: ValidatorFn<T>;
  value: T;
}

export interface FnConfig<T = Type> extends Config {
  fn: Fn<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Type = any;

export type Fn<T extends Type = Type> = () => T;

export type SanitizerFn<T extends Type = Type> = (value: unknown) => T;

export type NormalizerFn<T extends Type = Type> = (value: NonNullable<T>) => T;

export type ValidatorFn<T extends Type = Type> = (value: NonNullable<T>) => boolean;

export type Attrs<C extends Configs> = {
  [K in keyof C]: C[K] extends ValueConfig ? C[K]['value'] : C[K] extends FnConfig ? ReturnType<C[K]['fn']> : never;
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

type ReadOnlyConfigs<C extends Configs, VC = ValueConfigs<C>> = Pick<VC, {
  [K in keyof VC]: VC[K] extends ValueConfig ? VC[K]['readOnly'] extends true ? K : never : never;
}[keyof VC]>;
export type ReadOnlyAttrs<C extends Configs> = Attrs<ReadOnlyConfigs<C>>;

type WritableConfigs<C extends Configs> = Omit<ValueConfigs<C>, keyof ReadOnlyConfigs<C>>;
export type WritableAttrs<C extends Configs> = Attrs<WritableConfigs<C>>;

export type SanitizableAttrs<C extends Configs> = ValueAttrs<C>;

export type NormalizableAttrs<C extends Configs> = ValueAttrs<C>;

export type ValidatableAttrs<C extends Configs> = ValueAttrs<C>;

type OptionalKeysBuilder<A, B> = { [K in keyof A & keyof B]: A[K] extends B[K] ? never : K };

type OptionalKeys<T> = OptionalKeysBuilder<T, Required<T>>[keyof T];

export type AsOptional<A extends ValueConfig, T = NonNullable<A['value']> | undefined, B extends ValueConfig<T> = ValueConfig<T>> =
  Omit<A, 'value' | 'normalizer' | 'sanitizer' | 'sanitizer'>
  & Pick<B, 'value' | 'sanitizer'>
  & Pick<'normalizer' extends OptionalKeys<A> ? B : Required<B>, 'normalizer'>
  & Pick<'validator' extends OptionalKeys<A> ? B : Required<B>, 'validator'>;

export type AsHidden<A extends ValueConfig> = A & { hidden: true };

export type AsReadOnly<A extends ValueConfig> = A & { readOnly: true };

export type WithSanitizer<A extends ValueConfig> = A & Pick<Required<A>, 'sanitizer'>;

export type WithNormalizer<A extends ValueConfig> = A & Pick<Required<A>, 'normalizer'>;

export type WithValidator<A extends ValueConfig> = A & Pick<Required<A>, 'validator'>;

export type UnsanitizedAttrs<C extends Configs, AllowReadOnly extends boolean = false> = Record<keyof (AllowReadOnly extends true ? ValueAttrs<C> : WritableAttrs<C>), unknown>;

export type FillableAttrs<C extends Configs, AllowReadOnly extends boolean = false> = AllowReadOnly extends true ? ValueAttrs<C> : WritableAttrs<C>

export type EntityConstructorAttrs<C extends Configs> = Partial<ValueAttrs<C>>;

export type EntityInterface<C extends Configs> = Attrs<C>;

type A = AsOptional<ValueConfig<string>>;
//type B = WithNormalizer<ValueConfig<string>>;
//type Foo = AsOptional<A>;

const f: A = {
  value: 'asf',
  sanitizer: (v: unknown): string => String(v),
  normalizer: (v: string): string | undefined => v || undefined,
};
console.log(f);
