import { BaseError } from 'make-error-cause';
import type { Entity } from '../Entity';

export class EntityError extends BaseError {

  public readonly entity: Entity;

  public constructor(entity: Entity, message?: string, previous?: Error) {
    super(message, previous);
    this.entity = entity;
  }

}
