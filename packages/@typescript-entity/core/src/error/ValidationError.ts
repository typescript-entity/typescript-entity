import { Entity } from "../entity/Entity";
import type { Configs, StaticValue } from "../entity/Entity";
import { StaticAttrError } from "./StaticAttrError";

export class ValidationError<C extends Configs> extends StaticAttrError<C> {

  public attrValue: StaticValue;

  constructor(entity: Entity<C>, attrName: keyof C, attrValue: StaticValue, message?: string, previous?: Error) {
    super(entity, attrName, message || `Attribute "${entity.constructor.name}.${attrName}" received an invalid value.`, previous);
    this.attrValue = attrValue;
  }

}
