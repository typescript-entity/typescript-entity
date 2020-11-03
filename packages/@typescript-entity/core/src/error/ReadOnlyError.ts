import { Entity } from "../entity/Entity";
import type { Configs } from "../entity/Entity";
import { StaticAttrError } from "./StaticAttrError";

export class ReadOnlyError<C extends Configs> extends StaticAttrError<C> {

  constructor(entity: Entity<C>, attrName: keyof C, message?: string, previous?: Error) {
    super(entity, attrName, message || `Attribute "${entity.constructor.name}.${String(attrName)}" is read-only.`, previous);
  }

}
