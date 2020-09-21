import Entity from './Entity';
import { AttributeConfigs } from './types';
export default abstract class AttributeError<A extends AttributeConfigs> extends Error {
    entity: Entity<A>;
    attrName: keyof A;
    attrValue: any;
    constructor(message: string, entity: Entity<A>, attrName: keyof A, attrValue: any);
}
