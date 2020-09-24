import { cloneDeep } from 'lodash';
import { FunctionAttributeError, InvalidAttributeError, ReadonlyAttributeError } from './Error';
import { AttributeConfigs, AttributeNormalizerFn, AttributeValidatorFn, Entries, InferredAttributeValue, InferredAttributeValues, InitialAttributes, RawWritableAttributes, WritableAttributes } from './Type';

export default abstract class Entity<AC extends AttributeConfigs<any>> {

  protected attrConfigs: AC;

  constructor(attrConfigs: AC, initialAttrs: InitialAttributes<AC> = {}) {
    this.attrConfigs = Object.entries(attrConfigs).reduce((attrs, [ name, attrConfig ]) => ({
      ...attrs,
      [name]: {
        ...attrConfig,
        value: 'function' === typeof attrConfig.value ? attrConfig.value : cloneDeep(attrConfig.value),
      },
    }), {}) as AC;
    this.fill(initialAttrs, true);
  }

  public normalize<K extends keyof AC, AV extends InferredAttributeValue<AC[K]['value']>>(name: K, value: unknown): ReturnType<AttributeNormalizerFn<AV>> {
    if ('function' !== typeof this.attrConfigs[name]['normalizer']) {
      return value as AV;
    }
    return this.attrConfigs[name]['normalizer']!.call(this, value);
  }

  public validate<K extends keyof AC, AV extends InferredAttributeValue<AC[K]['value']>>(name: K, value: AV): ReturnType<AttributeValidatorFn<AV>> {
    if (undefined === value || 'function' !== typeof this.attrConfigs[name]['validator']) {
      return true;
    }
    return this.attrConfigs[name]['validator']!.call(this, value);
  }

  public all(): InferredAttributeValues<AC> {
    return Object.keys(this.attrConfigs).reduce((attrs, name) => ({
      ...attrs,
      [name]: this.get(name),
    }), {}) as InferredAttributeValues<AC>;
  }

  public get<K extends keyof AC>(name: K): InferredAttributeValue<AC[K]['value']> {
    return 'function' === typeof this.attrConfigs[name]['value']
      ? this.attrConfigs[name]['value'].call(this)
      : this.attrConfigs[name]['value'];
  }

  public set<K extends keyof RawWritableAttributes<AC, R>, R extends boolean = false>(name: K, value: unknown, allowReadonly?: R): this {
    value = this.normalize(name, value);
    if (!this.validate(name, value)) {
      throw new InvalidAttributeError<AC>(this, name, value);
    }
    return this.setDangerously(name, value, allowReadonly);
  }

  public setDangerously<A extends WritableAttributes<AC, R>, K extends keyof A, R extends boolean = false>(name: K, value: A[K], allowReadonly?: R): this {
    if ('function' === typeof this.attrConfigs[name]['value']) {
      throw new FunctionAttributeError<AC>(this, name, value);
    }
    if (!allowReadonly && this.attrConfigs[name]['readonly']) {
      throw new ReadonlyAttributeError<AC>(this, name, value);
    }
    this.attrConfigs[name]['value'] = value;
    return this;
  }

  public fill<A extends RawWritableAttributes<AC, R>, R extends boolean = false>(attrs: Partial<A>, allowReadonly?: R): this {
    (Object.entries(attrs) as Entries<A>).forEach(([ name, value ]) => {
      this.set(name as any, value, allowReadonly);
    });
    return this;
  }

  public fillDangerously<A extends WritableAttributes<AC, R>, R extends boolean = false>(attrs: Partial<A>, allowReadonly?: R): this {
    (Object.entries(attrs) as Entries<A>).forEach(([ name, value ]) => {
      this.setDangerously(name as any, value, allowReadonly);
    });
    return this;
  }

  public toJSON(): InferredAttributeValues<AC> {
    return this.all();
  }

}
