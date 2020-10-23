import { Entity } from "../entity/Entity";
import type { Configs } from "../entity/Entity";
import { EntityError } from "./EntityError";

export class UnknownDataError<C extends Configs> extends EntityError<C> {

  public data: unknown;

  constructor(entity: Entity<C>, data: unknown, message?: string, previous?: Error) {
    super(entity, message, previous);
    this.data = data;
  }

}
