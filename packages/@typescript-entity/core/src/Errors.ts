import Entity from './Entity';
import { Configs, Value } from './Types';

export abstract class EntityError<C extends Configs> extends Error {

  public entity: Entity<C>;

  constructor(entity: Entity<C>, message?: string) {
    super(message);
    this.entity = entity;
  }

}
export abstract class AttrError<C extends Configs> extends EntityError<C> {

  public attrName: keyof C;

  constructor(entity: Entity<C>, attrName: keyof C, message?: string) {
    super(entity, message);
    this.attrName = attrName;
  }

}

export abstract class AttrValueError<C extends Configs> extends AttrError<C> {

  public attrValue: Value;

  constructor(entity: Entity<C>, attrName: keyof C, attrValue: Value, message?: string) {
    super(entity, attrName, message);
    this.attrValue = attrValue;
  }

}

export class InvalidAttrValueError<C extends Configs> extends AttrValueError<C> {
  constructor(entity: Entity<C>, attrName: keyof C, attrValue: Value, message?: string) {
    super(entity, attrName, attrValue, message || `Attribute "${entity.constructor.name}.${attrName}" received an invalid value`);
  }
}
