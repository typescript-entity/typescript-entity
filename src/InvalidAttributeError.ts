import AttributeError from './AttributeError';
import Entity from './Entity';
import { AttributeConfigs } from './types';

export default class InvalidAttributeError<A extends AttributeConfigs> extends AttributeError<A> {

  constructor(entity: Entity<A>, attrName: keyof A, attrValue: any, message?: string) {
    super(message || `Invalid value provided for ${entity.constructor.name}.${attrName}: ${attrValue}`, entity, attrName, attrValue);
  }

}
