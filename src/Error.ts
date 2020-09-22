import Entity from './Entity';
import { AttributeConfigs } from './Type';

export abstract class AttributeError<A extends AttributeConfigs> extends Error {

  public entity: Entity<A>;
  public attrName: keyof A;
  public attrValue: any;

  constructor(message: string, entity: Entity<A>, attrName: keyof A, attrValue: any) {
    super(message);
    this.entity = entity;
    this.attrName = attrName;
    this.attrValue = attrValue;
  }

}

export class InvalidAttributeError<A extends AttributeConfigs> extends AttributeError<A> {
  constructor(entity: Entity<A>, attrName: keyof A, attrValue: any, message?: string) {
    super(message || `Invalid value provided for ${entity.constructor.name}.${attrName}: ${attrValue}`, entity, attrName, attrValue);
  }
}

export class NonwritableAttributeError<A extends AttributeConfigs> extends AttributeError<A> {
  constructor(entity: Entity<A>, attrName: keyof A, attrValue: any, message?: string) {
    super(message || `Cannot set value for non-writable attribute ${entity.constructor.name}.${attrName}: ${attrValue}`, entity, attrName, attrValue);
  }
}
