import { AttrValueError } from "./AttrValueError";
import { Entity } from "./Entity";
import type { Configs, Value } from "./Entity";

export class InvalidAttrValueError<C extends Configs> extends AttrValueError<C> {

  constructor(entity: Entity<C>, attrName: keyof C, attrValue: Value, message?: string, previous?: Error) {
    super(entity, attrName, attrValue, message || `Attribute "${entity.constructor.name}.${attrName}" received an invalid value.`, previous);
  }

}
