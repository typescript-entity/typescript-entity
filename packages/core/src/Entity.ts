import { cloneDeep } from 'lodash';
import { AttrReadonlyError, AttrUnregisteredError, AttrValueFnError, AttrValueInvalidError } from './Error';
import { AttrConfigs, AttrIncomingValues, AttrIncomingValuesUntyped, AttrInferredValue, AttrInferredValues, AttrInitialValues, AttrNormalizerFn, AttrValidatorFn, AttrValue, AttrValueFn } from './Type';

type Entries<T> = { [K in keyof T]: [ K, T[K] ] }[keyof T][];

function functionTypeGuard<FunctionType>(fn: unknown): fn is FunctionType {
  return 'function' === typeof fn;
}

function attrRegisteredTypeGuard<C extends AttrConfigs>(attrConfigs: C, name?: unknown): name is keyof C {
  return ('string' === typeof name || 'number' === typeof name || 'symbol' === typeof name) && name in attrConfigs;
}

function attrValueFnTypeGuard<V extends AttrValue>(value: unknown): value is AttrValueFn<V> {
  return functionTypeGuard<AttrValueFn<V>>(value);
}

function attrNormalizerFnTypeGuard<V extends AttrValue>(normalizer: unknown): normalizer is AttrNormalizerFn<V> {
  return functionTypeGuard<AttrNormalizerFn<V>>(normalizer);
}

function attrValidatorFnTypeGuard<V extends AttrValue>(validator: unknown): validator is AttrValidatorFn<V> {
  return functionTypeGuard<AttrValidatorFn<V>>(validator);
}

export default abstract class Entity<C extends AttrConfigs> {

  protected attrConfigs: C;

  constructor(attrConfigs: C, initialAttrs: AttrInitialValues<C> = {}) {
    this.attrConfigs = (Object.entries(attrConfigs) as Entries<C>).reduce((attrs, [ name, attrConfig ]) => ({
      ...attrs,
      [name]: {
        ...attrConfig,
        value: 'function' === typeof attrConfig.value ? attrConfig.value : cloneDeep(attrConfig.value),
      },
    }), {}) as C;
    this.fill(initialAttrs, true);
  }

  public normalize<K extends keyof C, I extends AttrInferredValue<C[K]['value']>>(name: K, value: unknown): ReturnType<AttrNormalizerFn<I>> {
    if (!attrRegisteredTypeGuard(this.attrConfigs, name)) {
      throw new AttrUnregisteredError<C>(this, name);
    }
    if (null === value || undefined === value) {
      return undefined as I;
    }
    const fn = this.attrConfigs[name].normalizer;
    return (undefined !== fn && attrNormalizerFnTypeGuard<I>(fn))
      ? fn.call(this, value)
      : value as I;
  }

  public validate<K extends keyof C, I extends AttrInferredValue<C[K]['value']>>(name: K, value: I): ReturnType<AttrValidatorFn<I>> {
    if (!attrRegisteredTypeGuard(this.attrConfigs, name)) {
      throw new AttrUnregisteredError<C>(this, name);
    }
    if (undefined === value) {
      return true;
    }
    const fn = this.attrConfigs[name].validator;
    return (undefined !== fn && attrValidatorFnTypeGuard<I>(fn))
      ? fn.call(this, value)
      : true;
  }

  public all(): AttrInferredValues<C> {
    return <AttrInferredValues<C>>Object.keys(this.attrConfigs).reduce((attrs, name) => ({
      ...attrs,
      [name]: this.get(name),
    }), {});
  }

  public get<K extends keyof C, V extends C[K]['value'], I extends AttrInferredValue<V>>(name: K): I {
    if (!attrRegisteredTypeGuard(this.attrConfigs, name)) {
      throw new AttrUnregisteredError<C>(this, name);
    }
    return (undefined !== this.attrConfigs[name].value && attrValueFnTypeGuard<I>(this.attrConfigs[name].value))
      ? this.attrConfigs[name].value.call(this)
      : this.attrConfigs[name].value;
  }

  public set<K extends keyof AttrIncomingValuesUntyped<C, R>, R extends boolean = false>(name: K, value: unknown, allowReadonly?: R): this {
    if (!attrRegisteredTypeGuard(this.attrConfigs, name)) {
      throw new AttrUnregisteredError<C>(this, name);
    }
    const normalized = this.normalize(name, value);
    if (!this.validate(name, normalized)) {
      throw new AttrValueInvalidError<C>(this, name, normalized);
    }
    return this.setDangerously(name, normalized, allowReadonly);
  }

  public setDangerously<A extends AttrIncomingValues<C, R>, K extends keyof A, R extends boolean = false>(name: K, value: A[K], allowReadonly?: R): this {
    if (!attrRegisteredTypeGuard(this.attrConfigs, name)) {
      throw new AttrUnregisteredError<C>(this, name);
    }
    if (attrValueFnTypeGuard<A[K]>(this.attrConfigs[name].value)) {
      throw new AttrValueFnError<C>(this, name, value);
    }
    if (this.attrConfigs[name].readonly && !allowReadonly) {
      throw new AttrReadonlyError<C>(this, name, value);
    }
    this.attrConfigs[name].value = value;
    return this;
  }

  public fill<A extends AttrIncomingValuesUntyped<C, R>, R extends boolean = false>(attrs: Partial<A>, allowReadonly?: R): this {
    (Object.entries(attrs) as Entries<AttrIncomingValuesUntyped<C, R>>).forEach(([ name, value ]) => { // TODO: Entries<A>
      this.set(name, value, allowReadonly);
    });
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