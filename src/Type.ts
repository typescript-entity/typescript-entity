export interface AttributeConfig<AV extends AttributeValue> {
  value: AV;
  readonly?: AV extends AttributeValueFn<any> ? true : boolean;
  normalizer?: AttributeNormalizerFn<InferredAttributeValue<AV>>;
  validator?: AttributeValidatorFn<InferredAttributeValue<AV>>;
};

export type AttributeConfigs<AN extends string> = {
  [K in AN]: AttributeConfig<any>;
};

export type AttributeValue = any;

export type AttributeValueFn<AV extends AttributeValue> = () => AV;

export type AttributeNormalizerFn<AV extends AttributeValue> = (value: any) => AV;

export type AttributeValidatorFn<AV extends AttributeValue> = (value: NonNullable<AV>) => boolean;

export type EntityInterface<AC extends AttributeConfigs<any>> = InferredAttributeValues<AC>;

export type Entries<T> = { [K in keyof T]: [ K, T[K] ] }[keyof T][];

export type InferredAttributeValue<AV extends AttributeValue | AttributeValueFn<any>> = AV extends AttributeValueFn<any> ? ReturnType<AV> : AV;

export type InferredAttributeValues<AC extends AttributeConfigs<any>> = {
  [K in keyof AC]: InferredAttributeValue<AC[K]['value']>;
};

export type InitialAttributes<AC extends AttributeConfigs<any>> = Partial<RawWritableAttributes<AC, true>>;

export type WritableAttributeConfigs<AC extends AttributeConfigs<any>, AllowReadonly extends boolean = false> = Pick<AC, { [K in keyof AC]: AC[K]['value'] extends AttributeValueFn<any> ? never : AC[K]['readonly'] extends true ? AllowReadonly extends true ? K : never : K }[keyof AC]>

export type WritableAttributes<AC extends AttributeConfigs<any>, AllowReadonly extends boolean = false> = InferredAttributeValues<WritableAttributeConfigs<AC, AllowReadonly>>;

export type RawWritableAttributes<AC extends AttributeConfigs<any>, AllowReadonly extends boolean = false> = Record<keyof WritableAttributeConfigs<AC, AllowReadonly>, any>;

export type WithNormalizer<AC extends AttributeConfig<any>> = AC & Required<Pick<AC, 'normalizer'>>;

export type WithReadonly<AC extends AttributeConfig<any>> = AC & { readonly: true };

export type WithValidator<AC extends AttributeConfig<any>> = AC & Required<Pick<AC, 'validator'>>;
