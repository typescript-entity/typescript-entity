import type { AttrName, Entity } from '../Entity';
import { EntityError } from './EntityError';

export class AttrError extends EntityError {

  public readonly attrName: AttrName;

  public constructor(entity: Entity, attrName: AttrName, message?: string, previous?: Error) {
    super(entity, message, previous);
    this.attrName = attrName;
  }

}
