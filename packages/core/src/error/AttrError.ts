import { Entity } from "../entity/Entity";
import type { Configs } from "../entity/Entity";
import { EntityError } from "./EntityError";

export class AttrError<C extends Configs = Configs, K extends keyof C = keyof C> extends EntityError<C> {

  public attrName: keyof C;

  constructor(entity: Entity<C>, attrName: K, message?: string, previous?: Error) {
    super(entity, message, previous);
    this.attrName = attrName;
  }

}
