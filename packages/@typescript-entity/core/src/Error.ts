import Entity from './Entity';
import { AttrConfigs } from './Type';

export abstract class AttrError<C extends AttrConfigs> extends Error {

  public entity: Entity<C>;
  public attrName: keyof C;

  constructor(message: string, entity: Entity<C>, attrName: keyof C) {
    super(message);
    this.entity = entity;
    this.attrName = attrName;
  }

}

export abstract class AttrValueError<C extends AttrConfigs> extends AttrError<C> {

  public attrValue: unknown;

  constructor(message: string, entity: Entity<C>, attrName: keyof C, attrValue: unknown) {
    super(message, entity, attrName);
    this.attrValue = attrValue;
  }

}

export class AttrValueInvalidError<C extends AttrConfigs> extends AttrValueError<C> {
  constructor(entity: Entity<C>, attrName: keyof C, attrValue: unknown, message?: string) {
    super(message || `Invalid value provided for ${entity.constructor.name}.${attrName}: ${attrValue}`, entity, attrName, attrValue);
  }
}

export class AttrRestrictedError<C extends AttrConfigs> extends AttrValueError<C> {
  constructor(entity: Entity<C>, attrName: keyof C, attrValue: unknown, message?: string) {
    super(message || `Cannot set value for restricted attribute ${entity.constructor.name}.${attrName}: ${attrValue}`, entity, attrName, attrValue);
  }
}

export class AttrReadOnlyError<C extends AttrConfigs> extends AttrRestrictedError<C> {}

export class AttrValueFnError<C extends AttrConfigs> extends AttrRestrictedError<C> {}

export class AttrUnregisteredError<C extends AttrConfigs> extends AttrError<C> {
  constructor(entity: Entity<C>, attrName: string | number | symbol, message?: string) {
    super(message || `Entity ${entity.constructor.name} does not contain an named attribute ${String(attrName)}`, entity, attrName as keyof C);
  }
}
