import { Entity } from '../entity/Entity';
import type { Configs } from '../entity/Entity';
import { RethrownError } from './RethrownError';

export class EntityError<C extends Configs = Configs> extends RethrownError {

  public entity: Entity<C>;

  constructor(entity: Entity<C>, message?: string, previous?: Error) {
    super(message, previous);
    this.entity = entity;
  }

}
