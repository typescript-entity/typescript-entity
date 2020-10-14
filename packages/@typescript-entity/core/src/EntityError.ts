import { Entity } from "./Entity";
import type { Configs } from "./Entity";
import { RethrownError } from "./RethrownError";

export class EntityError<C extends Configs> extends RethrownError {

  public entity: Entity<C>;

  constructor(entity: Entity<C>, message?: string, previous?: Error) {
    super(message, previous);
    this.entity = entity;
  }

}
