import Entity from './Entity';
import { AttributeConfigs } from './Type';
export declare abstract class AttributeError<A extends AttributeConfigs> extends Error {
    entity: Entity<A>;
    attrName: keyof A;
    attrValue: any;
    constructor(message: string, entity: Entity<A>, attrName: keyof A, attrValue: any);
}
export declare class InvalidAttributeError<A extends AttributeConfigs> extends AttributeError<A> {
    constructor(entity: Entity<A>, attrName: keyof A, attrValue: any, message?: string);
}
export declare class NonwritableAttributeError<A extends AttributeConfigs> extends AttributeError<A> {
    constructor(entity: Entity<A>, attrName: keyof A, attrValue: any, message?: string);
}
