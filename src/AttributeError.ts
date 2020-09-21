import Entity from './Entity';
import { AttributeConfigs } from './types';

export default abstract class AttributeError<A extends AttributeConfigs> extends Error {

  public entity: Entity<A>;
  public attrName: keyof A;
  public attrValue: any;

  constructor(message: string, entity: Entity<A>, attrName: keyof A, attrValue: any) {
    super(message);
    this.entity = entity;
    this.attrName = attrName;
    this.attrValue = attrValue;
  }

}
