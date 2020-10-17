import { Entity } from "../entity/Entity";
import type { Configs } from "../entity/Entity";
import { AttrError } from "./AttrError";

export class UnsanitizableAttrError<C extends Configs> extends AttrError<C> {

  constructor(entity: Entity<C>, attrName: keyof C, message?: string, previous?: Error) {
    super(entity, attrName, message || `Attribute "${entity.constructor.name}.${String(attrName)}" is not sanitizable.`, previous);
  }

}
