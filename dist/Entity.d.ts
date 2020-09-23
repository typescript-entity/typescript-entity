import { AttributeConfigs, AttributeNormalizerFn, AttributeValidatorFn, InferredAttributeValue, InferredAttributeValues, InitialAttributes, RawWritableAttributes, WritableAttributes } from './Type';
export default abstract class Entity<AC extends AttributeConfigs<any>> {
    protected attrConfigs: AC;
    constructor(attrConfigs: AC, initialAttrs?: InitialAttributes<AC>);
    normalize<K extends keyof AC, AV extends InferredAttributeValue<AC[K]['value']>>(name: K, value: any): ReturnType<AttributeNormalizerFn<AV>>;
    validate<K extends keyof AC, AV extends InferredAttributeValue<AC[K]['value']>>(name: K, value: AV): ReturnType<AttributeValidatorFn<AV>>;
    all(): InferredAttributeValues<AC>;
    get<K extends keyof AC>(name: K): InferredAttributeValue<AC[K]['value']>;
    set<K extends keyof RawWritableAttributes<AC, R>, R extends boolean = false>(name: K, value: any, allowReadonly?: R): this;
    setDangerously<A extends WritableAttributes<AC, R>, K extends keyof A, R extends boolean = false>(name: K, value: A[K], allowReadonly?: R): this;
    fill<A extends RawWritableAttributes<AC, R>, R extends boolean = false>(attrs: Partial<A>, allowReadonly?: R): this;
    fillDangerously<A extends WritableAttributes<AC, R>, R extends boolean = false>(attrs: Partial<A>, allowReadonly?: R): this;
    toJSON(): InferredAttributeValues<AC>;
}
