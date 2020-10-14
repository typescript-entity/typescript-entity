import { Entity } from "./Entity";
import type { Configs } from "./Entity";

export class EntityError<C extends Configs> extends Error {

  public entity: Entity<C>;

  constructor(entity: Entity<C>, message?: string) {
    super(message);
    this.entity = entity;
  }

}
