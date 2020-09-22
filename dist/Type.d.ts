import Entity from './Entity';
export interface StaticAttributeConfig<T extends AttributeType, A extends AttributeConfigs> {
    value?: T;
    readonly?: boolean;
    normalizer?: Normalizer<T, A>;
    validator?: Validator<T, A>;
}
export declare type Normalizer<T extends AttributeType, A extends AttributeConfigs> = (entity: Entity<A>, name: keyof A, value: NonNullable<any>) => T;
export declare type Validator<T extends AttributeType, A extends AttributeConfigs> = (entity: Entity<A>, name: keyof A, value: NonNullable<T>) => boolean;
export interface DynamicAttributeConfig<T extends AttributeType, A extends AttributeConfigs> {
    value: (entity: Entity<A>, name: keyof A) => T | undefined;
}
export declare type AttributeConfig<T extends AttributeType, A extends AttributeConfigs> = StaticAttributeConfig<T, A> | DynamicAttributeConfig<T, A>;
export interface AttributeConfigs {
}
export declare type Attributes<A extends AttributeConfigs> = {
    [K in keyof A]: ResolvedAttributeType<A[K]>;
};
export declare type AttributeType = Exclude<any, Function>;
export declare type AttributeName<A extends AttributeConfigs> = keyof A;
export declare type ResolvedAttributeType<A extends AttributeConfig<any, any>> = A extends DynamicAttributeConfig<any, any> ? ReturnType<A['value']> : A['value'];
export declare type RawAttributes<A extends AttributeConfigs> = {
    [K in keyof Attributes<A>]: any;
};
export declare type Entries<O> = {
    [K in keyof O]: [K, O[K]];
}[keyof O][];
