export interface AttributeConfig<AV extends AttributeValue> {
    value: AV;
    readonly?: AV extends AttributeValueFn<any> ? true : boolean;
    normalizer?: AttributeNormalizerFn<InferredAttributeValue<AV>>;
    validator?: AttributeValidatorFn<InferredAttributeValue<AV>>;
}
export declare type AttributeConfigs<AN extends string> = {
    [K in AN]: AttributeConfig<any>;
};
export declare type AttributeValue = any;
export declare type AttributeValueFn<AV extends AttributeValue> = () => AV;
export declare type AttributeNormalizerFn<AV extends AttributeValue> = (value: any) => AV;
export declare type AttributeValidatorFn<AV extends AttributeValue> = (value: NonNullable<AV>) => boolean;
export declare type EntityInterface<AC extends AttributeConfigs<any>> = InferredAttributeValues<AC>;
export declare type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];
export declare type InferredAttributeValue<AV extends AttributeValue | AttributeValueFn<any>> = AV extends AttributeValueFn<any> ? ReturnType<AV> : AV;
export declare type InferredAttributeValues<AC extends AttributeConfigs<any>> = {
    [K in keyof AC]: InferredAttributeValue<AC[K]['value']>;
};
export declare type InitialAttributes<AC extends AttributeConfigs<any>> = Partial<RawWritableAttributes<AC, true>>;
export declare type WritableAttributeConfigs<AC extends AttributeConfigs<any>, AllowReadonly extends boolean = false> = Pick<AC, {
    [K in keyof AC]: AC[K]['value'] extends AttributeValueFn<any> ? never : AC[K]['readonly'] extends true ? AllowReadonly extends true ? K : never : K;
}[keyof AC]>;
export declare type WritableAttributes<AC extends AttributeConfigs<any>, AllowReadonly extends boolean = false> = InferredAttributeValues<WritableAttributeConfigs<AC, AllowReadonly>>;
export declare type RawWritableAttributes<AC extends AttributeConfigs<any>, AllowReadonly extends boolean = false> = Record<keyof WritableAttributeConfigs<AC, AllowReadonly>, any>;
export declare type WithNormalizer<AC extends AttributeConfig<any>> = AC & Required<Pick<AC, 'normalizer'>>;
export declare type WithReadonly<AC extends AttributeConfig<any>> = AC & {
    readonly: true;
};
export declare type WithValidator<AC extends AttributeConfig<any>> = AC & Required<Pick<AC, 'validator'>>;
