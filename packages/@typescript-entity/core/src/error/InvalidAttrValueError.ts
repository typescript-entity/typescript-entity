import { Entity } from "../entity/Entity";
import type { Configs, Value } from "../entity/Entity";
import { AttrValueError } from "./AttrValueError";

export class InvalidAttrValueError<C extends Configs> extends AttrValueError<C> {

  constructor(entity: Entity<C>, attrName: keyof C, attrValue: Value, message?: string, previous?: Error) {
    super(entity, attrName, attrValue, message || `Attribute "${entity.constructor.name}.${attrName}" received an invalid value.`, previous);
  }

}
