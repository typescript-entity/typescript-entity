export type Configs = Record<string, Config>;

export type Config<V extends Value | ValueFn = Value> = (
  {
    hidden?: boolean;
    value: V;
  } & (
    V extends ValueFn
      ? {
        normalizer?: never;
        readOnly?: never;
        sanitizer?: never;
        validator?: never;
      }
      : {
        normalizer?: NormalizerFn<V>;
        readOnly?: boolean;
        sanitizer: SanitizerFn<V>;
        validator?: ValidatorFn<V>;
      }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Value = any;

export type ValueFn<V extends Value = Value> = () => V;

export type SanitizerFn<V extends Value = Value> = (value: unknown) => V;

export type NormalizerFn<V extends Value = Value> = (value: NonNullable<V>) => V;

export type ValidatorFn<V extends Value = Value> = (value: NonNullable<V>) => boolean;

export type Attrs<C extends Configs> = {
  [K in keyof C]: Attr<C, K>;
};

export type Attr<C extends Configs, K extends keyof C> = C[K]['value'] extends ValueFn ? ReturnType<C[K]['value']> : C[K]['value'];

export type Unsanitized<Attrs> = Record<keyof Attrs, unknown>;

export type HiddenAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K]['hidden'] extends true ? K : never;
}[keyof C]>>;

export type VisibleAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K]['hidden'] extends true ? never : K;
}[keyof C]>>;

export type NonValueFnAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K]['value'] extends ValueFn ? never : K;
}[keyof C]>>;

export type WritableAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof NonValueFnAttrs<C>]: C[K]['readOnly'] extends true ? never : K;
}[keyof NonValueFnAttrs<C>]>>;

export type EntityConstructorAttrs<C extends Configs> = Partial<NonValueFnAttrs<C>>;

export type EntityInterface<C extends Configs> = Attrs<C>;
