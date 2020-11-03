import { Entity } from "../entity/Entity";
import type { Configs } from "../entity/Entity";
import { EntityError } from "./EntityError";

export class AttrError<C extends Configs> extends EntityError<C> {

  public attrName: keyof C;

  constructor(entity: Entity<C>, attrName: keyof C, message?: string, previous?: Error) {
    super(entity, message, previous);
    this.attrName = attrName;
  }

}
