import { Entity } from '../entity/Entity';
import type { Attr, Configs, ValueAttrs } from '../entity/Entity';
import { ValueAttrError } from './ValueAttrError';

export class NormalizationError<C extends Configs = Configs, K extends keyof ValueAttrs<C> = keyof ValueAttrs<C>, V extends Attr<C, K> = Attr<C, K>> extends ValueAttrError<C> {

  public readonly attrValue: V;

  public constructor(entity: Entity<C>, attrName: K, attrValue: V, message?: string, previous?: Error) {
    super(entity, attrName, message || `Attribute '${entity.constructor.name}.${String(attrName)}' received a value that could not be normalized.`, previous);
    this.attrValue = attrValue;
  }

}
