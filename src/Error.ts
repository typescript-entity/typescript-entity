import Entity from './Entity';
import { AttributeConfigs } from './Type';

export abstract class AttributeError<AC extends AttributeConfigs<any>> extends Error {

  public entity: Entity<AC>;
  public attrName: keyof AC;
  public attrValue: any;

  constructor(message: string, entity: Entity<AC>, attrName: keyof AC, attrValue: any) {
    super(message);
    this.entity = entity;
    this.attrName = attrName;
    this.attrValue = attrValue;
  }

}

export class InvalidAttributeError<AC extends AttributeConfigs<any>> extends AttributeError<AC> {
  constructor(entity: Entity<AC>, attrName: keyof AC, attrValue: any, message?: string) {
    super(message || `Invalid value provided for ${entity.constructor.name}.${attrName}: ${attrValue}`, entity, attrName, attrValue);
  }
}

export class NonWritableAttributeError<AC extends AttributeConfigs<any>> extends AttributeError<AC> {
  constructor(entity: Entity<AC>, attrName: keyof AC, attrValue: any, message?: string) {
    super(message || `Cannot set value for non-writable attribute ${entity.constructor.name}.${attrName}: ${attrValue}`, entity, attrName, attrValue);
  }
}

export class FunctionAttributeError<AC extends AttributeConfigs<any>> extends NonWritableAttributeError<AC> {}

export class ReadonlyAttributeError<AC extends AttributeConfigs<any>> extends NonWritableAttributeError<AC> {}
