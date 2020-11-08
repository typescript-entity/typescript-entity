import { Entity } from '../entity/Entity';
import type { Configs } from '../entity/Entity';
import { EntityError } from './EntityError';

export class UnconfiguredAttrError<C extends Configs> extends EntityError<C> {

  public attrName: unknown;

  constructor(entity: Entity<C>, attrName: unknown, message?: string, previous?: Error) {
    super(entity, message || `Attribute '${entity.constructor.name}.${String(attrName)}' has not been configured.`, previous);
    this.attrName = attrName;
  }

}
