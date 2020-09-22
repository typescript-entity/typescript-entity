import { cloneDeep } from 'lodash';
import { InvalidAttributeError, NonwritableAttributeError } from './Error';
import { AttributeConfig, AttributeConfigs, AttributeName, Attributes, Entries, RawAttributes, ResolvedAttributeType } from './Type';

export default abstract class Entity<A extends AttributeConfigs> {

  private attributeConfigs: A;

  public constructor(attributeConfigs: A, attrs: Partial<RawAttributes<A>> = {}) {
    this.attributeConfigs = attributeConfigs;
    this.fill(cloneDeep(attrs), true, true, true);
  }

  public attr<K extends AttributeName<A>>(name: K): ResolvedAttributeType<A[K]> {
    const attrConfig:AttributeConfig<any, A> = this.attributeConfigs[name];
    return 'function' === typeof attrConfig.value ? attrConfig.value(this, name) : attrConfig.value;
  }

  public attrs() {
    return (Object.keys(this.attributeConfigs) as AttributeName<A>[]).reduce((accumulator, name) => ({
      ...accumulator,
      [name]: this.attr(name),
    }), {}) as Attributes<A>;
  }

  public fill(attrs: Partial<RawAttributes<A>>, normalize = true, validate = true, allowReadonly = false) {
    if (normalize) {
      attrs = this.normalizeAttrs(attrs);
    }
    if (validate) {
      this.validateAttrs(attrs, true);
    }
    (Object.entries(attrs) as Entries<Partial<Attributes<A>>>)
      .filter(([ name ]) => !!this.attributeConfigs[name])
      .forEach(([ name, value ]) => {
        const attrConfig:AttributeConfig<any, A> = this.attributeConfigs[name];
        if ((!allowReadonly && attrConfig.readonly) || 'function' === typeof attrConfig.value) {
          throw new NonwritableAttributeError(this, name, value);
        }
        attrConfig.value = value;
      });
    return this;
  }

  public normalizeAttr<K extends keyof A>(name: K, value?: any): ResolvedAttributeType<A[K]> {
    const attrConfig:AttributeConfig<any, A> = this.attributeConfigs[name];
    return undefined !== attrConfig && undefined !== value && 'function' === typeof attrConfig.normalizer ? attrConfig.normalizer(this, name, value) : value;
  }

  public normalizeAttrs<R extends Partial<RawAttributes<A>>>(attrs: R) {
    return (Object.entries(attrs) as Entries<RawAttributes<A>>)
      .filter(([ name ]) => !!this.attributeConfigs[name])
      .reduce((acc, [ name, value ]) => ({
        ...acc,
        [name]: this.normalizeAttr(name, value),
      }), {} as Pick<Attributes<A>, Extract<keyof Attributes<A>, keyof R>>);
  }

  public validateAttr<K extends keyof A>(name: K, value?: ResolvedAttributeType<A[K]>, throwOnInvalid = false) {
    const attrConfig:AttributeConfig<any, A> = this.attributeConfigs[name];
    if (undefined === attrConfig || undefined === value || 'function' !== typeof attrConfig.validator || attrConfig.validator(this, name, value)) {
      return true;
    }
    if (throwOnInvalid) {
      throw new InvalidAttributeError(this, name, value);
    }
    return false;
  }

  public validateAttrs(attrs: Partial<Attributes<A>>, throwOnInvalid = false) {
    return !!(Object.entries(attrs) as Entries<Attributes<A>>)
      .filter(([ name ]) => !!this.attributeConfigs[name])
      .find(([ name, value ]) => !this.validateAttr(name, value, throwOnInvalid));
  }

  toJSON() {
    return this.attrs();
  }

}
