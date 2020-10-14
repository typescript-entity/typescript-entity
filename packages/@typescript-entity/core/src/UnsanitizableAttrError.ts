import { AttrError } from "./AttrError";
import { Entity } from "./Entity";
import type { Configs } from "./Entity";

export class UnsanitizableAttrError<C extends Configs> extends AttrError<C> {

  constructor(entity: Entity<C>, attrName: keyof C, message?: string, previous?: Error) {
    super(entity, attrName, message || `Attribute "${entity.constructor.name}.${String(attrName)}" is not sanitizable.`, previous);
  }

}
