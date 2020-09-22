import { AttributeConfigs, AttributeName, Attributes, RawAttributes, ResolvedAttributeType } from './Type';
export default abstract class Entity<A extends AttributeConfigs> {
    private attributeConfigs;
    constructor(attributeConfigs: A, attrs?: Partial<RawAttributes<A>>);
    attr<K extends AttributeName<A>>(name: K): ResolvedAttributeType<A[K]>;
    attrs(): Attributes<A>;
    fill(attrs: Partial<RawAttributes<A>>, normalize?: boolean, validate?: boolean, allowReadonly?: boolean): this;
    normalizeAttr<K extends keyof A>(name: K, value?: any): ResolvedAttributeType<A[K]>;
    normalizeAttrs<R extends Partial<RawAttributes<A>>>(attrs: R): Pick<Attributes<A>, Extract<keyof A, keyof R>>;
    validateAttr<K extends keyof A>(name: K, value?: ResolvedAttributeType<A[K]>, throwOnInvalid?: boolean): boolean;
    validateAttrs(attrs: Partial<Attributes<A>>, throwOnInvalid?: boolean): boolean;
    toJSON(): Attributes<A>;
}
