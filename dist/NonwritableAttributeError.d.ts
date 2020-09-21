import AttributeError from './AttributeError';
import Entity from './Entity';
import { AttributeConfigs } from './types';
export default class NonwritableAttributeError<A extends AttributeConfigs> extends AttributeError<A> {
    constructor(entity: Entity<A>, attrName: keyof A, attrValue: any, message?: string);
}
