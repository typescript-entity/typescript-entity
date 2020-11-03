import { Entity } from "../entity/Entity";
import type { Configs } from "../entity/Entity";
import { StaticAttrError } from "./StaticAttrError";

export class SanitizationError<C extends Configs> extends StaticAttrError<C> {

  public attrValue: unknown;

  constructor(entity: Entity<C>, attrName: keyof C, attrValue: unknown, message?: string, previous?: Error) {
    super(entity, attrName, message || `Attribute "${entity.constructor.name}.${String(attrName)}" could not be sanitized.`, previous);
    this.attrValue = attrValue;
  }

}
