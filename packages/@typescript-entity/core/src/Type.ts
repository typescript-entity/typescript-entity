export interface AttrConfigs {
  [name: string]: AttrConfig;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AttrConfig<V = AttrValue> {
  value: V;
  hidden?: boolean;
  readOnly?: V extends AttrValueFn<any> ? never : boolean;
  normalizer?: V extends AttrValueFn<any> ? never : AttrNormalizerFn<V>;
  validator?: V extends AttrValueFn<any> ? never : AttrValidatorFn<V>;
}

export type AttrValue = any;
/* eslint-enable @typescript-eslint/no-explicit-any */

export type AttrValueFn<V extends AttrValue> = () => V;

export type AttrNormalizerFn<V> = (value: unknown) => V;

export type AttrValidatorFn<V> = (value: NonNullable<V>) => boolean;

export type AttrInferredValue<V> = V extends AttrValueFn<AttrValue> ? ReturnType<V> : V;

export type AttrInferredValues<C extends AttrConfigs> = {
  [K in keyof C]: AttrInferredValue<C[K]['value']>;
};

export type AttrHiddenConfigs<C extends AttrConfigs> = Pick<C, {
  [K in keyof C]: C[K]['hidden'] extends true ? K : never;
}[keyof C]>;

export type AttrVisibleConfigs<C extends AttrConfigs> = Pick<C, {
  [K in keyof C]: C[K]['hidden'] extends true ? never : K;
}[keyof C]>;

export type AttrUnrestrictedConfigs<C extends AttrConfigs, AllowReadOnly extends boolean = false> = Pick<C, {
  [K in keyof C]: C[K]['value'] extends AttrValueFn<AttrValue> ? never : C[K]['readOnly'] extends true ? AllowReadOnly extends true ? K : never : K;
}[keyof C]>;

export type AttrIncomingValues<C extends AttrConfigs, AllowReadOnly extends boolean = false> = AttrInferredValues<AttrUnrestrictedConfigs<C, AllowReadOnly>>;

export type AttrIncomingValuesUntyped<C extends AttrConfigs, AllowReadOnly extends boolean = false> = AttrUntypedValues<AttrUnrestrictedConfigs<C, AllowReadOnly>>;

export type AttrUntypedValues<C extends AttrConfigs> = Record<keyof C, unknown>;

export type AttrInitialValues<C extends AttrConfigs> = Partial<AttrUntypedValues<AttrUnrestrictedConfigs<C, true>>>;

export type EntityInterface<C extends AttrConfigs> = AttrInferredValues<C>;

export type AsOptional<A extends AttrConfig> = Omit<A, 'value'> & { value: A['value'] | undefined };

export type AsHidden<A extends AttrConfig> = A & { hidden: true };

export type AsReadOnly<A extends AttrConfig> = A & { readOnly: true };

export type WithNormalizer<A extends AttrConfig> = A & Pick<Required<A>, 'normalizer'>;

export type WithValidator<A extends AttrConfig> = A & Pick<Required<A>, 'validator'>;
