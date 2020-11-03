import { Entity } from "../entity/Entity";
import type { Configs, ValueAttrs } from "../entity/Entity";
import { ValueAttrError } from "./ValueAttrError";

export class SanitizationError<C extends Configs, K extends keyof ValueAttrs<C>> extends ValueAttrError<C> {

  public attrValue: unknown;

  constructor(entity: Entity<C>, attrName: K, attrValue: unknown, message?: string, previous?: Error) {
    super(entity, attrName, message || `Attribute "${entity.constructor.name}.${attrName}" received a value that could not be sanitized.`, previous);
    this.attrValue = attrValue;
  }

}
