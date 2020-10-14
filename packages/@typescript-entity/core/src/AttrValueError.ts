import { AttrError } from "./AttrError";
import { Entity } from "./Entity";
import type { Configs, Value } from "./Entity";

export class AttrValueError<C extends Configs> extends AttrError<C> {

  public attrValue: Value;

  constructor(entity: Entity<C>, attrName: keyof C, attrValue: Value, message?: string, previous?: Error) {
    super(entity, attrName, message, previous);
    this.attrValue = attrValue;
  }

}
