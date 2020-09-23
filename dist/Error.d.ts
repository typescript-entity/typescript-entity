import Entity from './Entity';
import { AttributeConfigs } from './Type';
export declare abstract class AttributeError<AC extends AttributeConfigs<any>> extends Error {
    entity: Entity<AC>;
    attrName: keyof AC;
    attrValue: any;
    constructor(message: string, entity: Entity<AC>, attrName: keyof AC, attrValue: any);
}
export declare class InvalidAttributeError<AC extends AttributeConfigs<any>> extends AttributeError<AC> {
    constructor(entity: Entity<AC>, attrName: keyof AC, attrValue: any, message?: string);
}
export declare class NonWritableAttributeError<AC extends AttributeConfigs<any>> extends AttributeError<AC> {
    constructor(entity: Entity<AC>, attrName: keyof AC, attrValue: any, message?: string);
}
export declare class FunctionAttributeError<AC extends AttributeConfigs<any>> extends NonWritableAttributeError<AC> {
}
export declare class ReadonlyAttributeError<AC extends AttributeConfigs<any>> extends NonWritableAttributeError<AC> {
}
