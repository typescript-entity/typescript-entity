import { Entity } from '../entity/Entity';
import type { Attr, Configs, ValueAttrs } from '../entity/Entity';
import { ValueAttrError } from './ValueAttrError';

export class ReadOnlyError<C extends Configs = Configs, K extends keyof ValueAttrs<C> = keyof ValueAttrs<C>, V extends Attr<C, K> = Attr<C, K>> extends ValueAttrError<C> {

  public attrValue: V;

  constructor(entity: Entity<C>, attrName: K, attrValue: V, message?: string, previous?: Error) {
    super(entity, attrName, message || `Attribute '${entity.constructor.name}.${String(attrName)}' received a value but is read-only.`, previous);
    this.attrValue = attrValue;
  }

}
