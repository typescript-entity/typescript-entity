import Entity from './Entity';

export interface StaticAttributeConfig<T extends AttributeType, A extends AttributeConfigs> {
  value?: T;
  readonly?: boolean;
  normalizer?: Normalizer<T, A>;
  validator?: Validator<T, A>;
};

export type Normalizer<T extends AttributeType, A extends AttributeConfigs> = (entity: Entity<A>, name: keyof A, value: any) => T;

export type Validator<T extends AttributeType, A extends AttributeConfigs> = (entity: Entity<A>, name: keyof A, value: T) => boolean;

export interface DynamicAttributeConfig<T extends AttributeType, A extends AttributeConfigs> {
  value: (entity: Entity<A>, name: keyof A) => T | undefined;
};

export type AttributeConfig<T extends AttributeType, A extends AttributeConfigs> = StaticAttributeConfig<T, A> | DynamicAttributeConfig<T, A>;

export interface AttributeConfigs {};

export type Attributes<A extends AttributeConfigs> = {
  [K in keyof A]: ResolvedAttributeType<A[K]>;
};

export type AttributeType = string | string[] | number | number[] | boolean | boolean[];

export type AttributeName<A extends AttributeConfigs> = keyof A;

export type ResolvedAttributeType<A extends AttributeConfig<any, any>> = A extends DynamicAttributeConfig<any, any> ? ReturnType<A['value']> : A['value'];

export type RawAttributes<A extends AttributeConfigs> = {
  [K in keyof Attributes<A>]: any;
};

export type Entries<O> = {
  [K in keyof O]: [K, O[K]];
}[keyof O][];
