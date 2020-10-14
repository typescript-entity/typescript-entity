import { AttrError } from "./AttrError";
import { Entity } from "./Entity";
import type { Configs } from "./Entity";

export class UnknownAttrError<C extends Configs> extends AttrError<C> {

  constructor(entity: Entity<C>, attrName: unknown, message?: string) {
    super(entity, attrName as keyof C, message || `Attribute "${entity.constructor.name}.${String(attrName)}" does not exist.`);
  }

}
