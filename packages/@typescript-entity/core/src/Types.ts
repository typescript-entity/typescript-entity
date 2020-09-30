export interface Configs {
  [name: string]: ValueConfig | ValueFnConfig;
}

interface Config {
  hidden?: boolean;
}

export interface ValueConfig<V = Value> extends Config {
  value: V;
  normalizer?: NormalizerFn<V>;
  readOnly?: boolean;
  sanitizer: SanitizerFn<V>;
  validator?: ValidatorFn<V>;
}

export interface ValueFnConfig<V = Value> extends Config {
  value: () => V;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Value = any;

export type ValueFn<V = Value> = () => V;

export type SanitizerFn<V> = (value: unknown) => V;

export type NormalizerFn<V> = (value: NonNullable<V>) => V;

export type ValidatorFn<V> = (value: NonNullable<V>) => boolean;

export type Attrs<C extends Configs> = {
  [K in keyof C]: Attr<C, K>;
};

export type Attr<C extends Configs, K extends keyof C> = C[K] extends ValueFnConfig ? ReturnType<C[K]['value']> : C[K]['value'];

export type Unsanitized<Attrs> = Record<keyof Attrs, unknown>;

export type HiddenAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K]['hidden'] extends true ? K : never;
}[keyof C]>>;

export type VisibleAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K]['hidden'] extends true ? never : K;
}[keyof C]>>;

export type ValueAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K] extends ValueConfig ? K : never;
}[keyof C]>>;

export type WritableAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K] extends ValueConfig
    ? C[K]['readOnly'] extends true
      ? never
      : K
    : never;
}[keyof C]>>;
