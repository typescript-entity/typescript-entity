import { cloneDeep } from 'lodash';
import { AttrReadonlyError, AttrUnregisteredError, AttrValueFnError, AttrValueInvalidError } from './Error';
import { AttrConfigs, AttrIncomingValues, AttrIncomingValuesUntyped, AttrInferredValue, AttrInferredValues, AttrInitialValues, AttrNormalizerFn, AttrValidatorFn, AttrValue, AttrValueFn } from './Type';

type Entries<T> = { [K in keyof T]: [ K, T[K] ] }[keyof T][];

function functionTypeGuard<FunctionType>(fn?: unknown): fn is FunctionType {
  return 'function' === typeof fn;
}

function attrRegisteredTypeGuard<C extends AttrConfigs>(attrConfigs: C, name?: unknown): name is keyof C {
  return ('string' === typeof name || 'number' === typeof name || 'symbol' === typeof name) && name in attrConfigs;
}

function attrValueFnTypeGuard<V extends AttrValue>(value: unknown): value is AttrValueFn<V> {
  return functionTypeGuard<AttrValueFn<V>>(value);
}

function attrNormalizerFnTypeGuard<V extends AttrValue>(normalizer?: unknown): normalizer is AttrNormalizerFn<V> {
  return functionTypeGuard<AttrNormalizerFn<V>>(normalizer);
}

function attrValidatorFnTypeGuard<V extends AttrValue>(validator?: unknown): validator is AttrValidatorFn<V> {
  return functionTypeGuard<AttrValidatorFn<V>>(validator);
}

export default abstract class Entity<C extends AttrConfigs> {

  protected attrConfigs: C;

  constructor(attrConfigs: C, initialAttrs: AttrInitialValues<C> = {}) {
    this.attrConfigs = Object.entries(attrConfigs).reduce((attrs, [ name, attrConfig ]) => ({
      ...attrs,
      [name]: {
        ...attrConfig,
        value: 'function' === typeof attrConfig.value ? attrConfig.value : cloneDeep(attrConfig.value),
      },
    }), {}) as C;
    this.fill(initialAttrs, true);
  }

  protected attrConfig<K extends keyof C>(name: K): C[K] {
    if (!attrRegisteredTypeGuard(this.attrConfigs, name)) {
      throw new AttrUnregisteredError<C>(this, name);
    }
    return this.attrConfigs[name];
  }

  public normalize<K extends keyof C, I extends AttrInferredValue<C[K]['value']>>(name: K, value: unknown): ReturnType<AttrNormalizerFn<I>> {
    if (null === value) {
      value = undefined;
    }
    const config = this.attrConfig(name);
    return (attrNormalizerFnTypeGuard<I>(config.normalizer) && undefined !== value)
      ? config.normalizer.call(this, value)
      : value as I;
  }

  public validate<K extends keyof C, I extends AttrInferredValue<C[K]['value']>>(name: K, value: I): ReturnType<AttrValidatorFn<I>> {
    const config = this.attrConfig(name);
    return (attrValidatorFnTypeGuard(config.validator) && undefined !== value)
      ? config.validator.call(this, value)
      : true;
  }

  public all(): AttrInferredValues<C> {
    return Object.keys(this.attrConfigs).reduce((attrs, name) => ({
      ...attrs,
      [name]: this.get(name),
    }), {}) as AttrInferredValues<C>;
  }

  public get<K extends keyof C, V extends C[K]['value'], I extends AttrInferredValue<V>>(name: K): I {
    const config = this.attrConfig(name);
    return attrValueFnTypeGuard(config.value)
      ? config.value.call(this)
      : config.value;
  }

  public set<K extends keyof AttrIncomingValuesUntyped<C, R>, R extends boolean = false>(name: K, value: unknown, allowReadonly?: R): this {
    const normalized = this.normalize(name, value);
    if (!this.validate(name, normalized)) {
      throw new AttrValueInvalidError<C>(this, name, normalized);
    }
    return this.setDangerously(name, normalized, allowReadonly);
  }

  public fill<A extends AttrIncomingValuesUntyped<C, R>, R extends boolean = false>(attrs: Partial<A>, allowReadonly?: R): this {
    (Object.entries(attrs) as Entries<A>).forEach(([ name, value ]) => {
      this.set(name as keyof AttrIncomingValuesUntyped<C, R>, value, allowReadonly); // TODO: Why the need for hinting?
    });
    return this;
  }

  public setDangerously<A extends AttrIncomingValues<C, R>, K extends keyof A, R extends boolean = false>(name: K, value: A[K], allowReadonly?: R): this {
    const config = this.attrConfig(name as keyof C); // TODO: Why the need for hinting?
    if (attrValueFnTypeGuard(config.value)) {
      throw new AttrValueFnError<C>(this, name as keyof C, value); // TODO: Why the need for hinting?
    }
    if (config.readonly && !allowReadonly) {
      throw new AttrReadonlyError<C>(this, name as keyof C, value); // TODO: Why the need for hinting?
    }
    config.value = value;
    return this;
  }

  public fillDangerously<A extends AttrIncomingValues<C, R>, R extends boolean = false>(attrs: Partial<A>, allowReadonly?: R): this {
    (Object.entries(attrs) as Entries<A>).forEach(([ name, value ]) => {
      this.setDangerously(name, value, allowReadonly);
    });
    return this;
  }

  public toJSON(): AttrInferredValues<C> {
    return this.all();
  }

}
