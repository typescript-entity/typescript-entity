import type { Entity } from '../Entity';
import { RethrownError } from './RethrownError';

export class EntityError extends RethrownError {

  public readonly entity: Entity;

  public constructor(entity: Entity, message?: string, previous?: Error) {
    super(message, previous);
    this.entity = entity;
  }

}
