import type { AttrName, AttrValue, Entity } from '../Entity';
import { AttrError } from './AttrError';

export class AttrValueError extends AttrError {

  public readonly attrValue: AttrValue;

  public constructor(entity: Entity, attrName: AttrName, attrValue: AttrValue, message?: string, previous?: Error) {
    super(entity, attrName, message, previous);
    this.attrValue = attrValue;
  }

}
