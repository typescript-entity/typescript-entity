import { cloneDeep } from 'lodash';
import { AttrReadOnlyError, AttrRestrictedError, AttrUnregisteredError, AttrValueFnError, AttrValueInvalidError } from './Error';
import { AttrConfigs, AttrHiddenConfigs, AttrIncomingValues, AttrInferredValue, AttrInferredValues, AttrInitialValues, AttrNormalizerFn, AttrValidatorFn, AttrValue, AttrValueFn, AttrVisibleConfigs } from './Type';

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

  /**
   * Creates a new [[`Entity`]] instance. The `attrConfigs` defines the attributes available on the
   * [[`Entity`]] instance along with default values for required attributes. Initial attribute
   * values (including values for `readonly` attributes) can be provided in `attrs`.
   *
   * @param attrConfigs
   * @param attrs
   */
  constructor(attrConfigs: C, attrs: AttrInitialValues<C> = {}) {
    this.attrConfigs = (Object.entries(attrConfigs) as Entries<C>).reduce((attrConfigs, [ name, attrConfig ]) => ({
      ...attrConfigs,
      [name]: {
        ...attrConfig,
        value: 'function' === typeof attrConfig.value ? attrConfig.value : cloneDeep(attrConfig.value),
      },
    }), {}) as C;
    this.fill(attrs, true);
  }

  /**
   * Normalizes a value using the normalizer function provided in the attribute configs. The
   * normalizer function is not called if `value` is `null` or `undefined`. While Typescript takes
   * care of ensuring type safety, it may be appropriate to perform casting within your normalizer
   * functions in cases where your [[`Entity`]] classes are used outside of Typescript.
   *
   * @param name
   * @param value
   */
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

  /**
   * Validates a `value` using the validator function provided in the attribute configs. The
   * validator function is not called if `value` is `null` or `undefined`. While Typescript takes
   * care of ensuring type safety, it may be appropriate to perform type-checking within your
   * validator functions in cases where your [[`Entity`]] classes are used outside of Typescript.
   *
   * @param name
   * @param value
   */
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

  /**
   * Returns all attribute names and values on the [[`Entity`]] instance.
   */
  public all(): AttrInferredValues<C> {
    return Object.keys(this.attrConfigs).reduce((attrs, name) => ({
      ...attrs,
      [name]: this.get(name),
    }), {}) as AttrInferredValues<C>;
  }

  /**
   * Returns all hidden attribute names and values on the [[`Entity`]] instance.
   */
  public hidden(): AttrInferredValues<AttrHiddenConfigs<C>> {
    return Object.keys(this.attrConfigs)
      .filter((name) => this.attrConfigs[name].hidden)
      .reduce((attrs, name) => ({
        ...attrs,
        [name]: this.get(name),
      }), {}) as AttrInferredValues<AttrHiddenConfigs<C>>;
  }

  /**
   * Returns all visible attribute names and values on the [[`Entity`]] instance.
   */
  public visible(): AttrInferredValues<AttrVisibleConfigs<C>> {
    return Object.keys(this.attrConfigs)
      .filter((name) => !this.attrConfigs[name].hidden)
      .reduce((attrs, name) => ({
        ...attrs,
        [name]: this.get(name),
      }), {}) as AttrInferredValues<AttrVisibleConfigs<C>>;
  }

  /**
   * Returns the value of the specified attribute `name`. If the attribute is configured with a
   * value function then the return value of this function is returned.
   *
   * @param name
   */
  public get<K extends keyof C, V extends C[K]['value'], I extends AttrInferredValue<V>>(name: K): I {
    if (!attrRegisteredTypeGuard(this.attrConfigs, name)) {
      throw new AttrUnregisteredError<C>(this, name);
    }
    return (undefined !== this.attrConfigs[name].value && attrValueFnTypeGuard<I>(this.attrConfigs[name].value))
      ? this.attrConfigs[name].value.call(this)
      : this.attrConfigs[name].value;
  }

  /**
   * Sets the `value` of the specified attribute `name`. If the attribute is configured with a value
   * function or is `readOnly` (unless `allowReadOnly` is set to `true`) then an error is thrown.
   * The `value` provided will be normalized and validated. If validation fails an error is thrown
   * and the attribute is unchanged.
   *
   * @param name
   * @param value
   * @param allowReadOnly
   */
  public set<K extends keyof AttrIncomingValues<C, R>, R extends boolean = false>(name: K, value: unknown, allowReadOnly?: R): this {
    if (!attrRegisteredTypeGuard(this.attrConfigs, name)) {
      throw new AttrUnregisteredError<C>(this, name);
    }
    const normalized = this.normalize(name, value);
    if (!this.validate(name, normalized)) {
      throw new AttrValueInvalidError<C>(this, name, normalized);
    }
    return this.setDangerously(name, normalized, allowReadOnly);
  }

  /**
   * Sets the `value` of the specified attribute `name`. If the attribute is configured with a value
   * function or is `readOnly` (unless `allowReadOnly` is set to `true`) then an error is thrown.
   * The `value` provided will not be normalized nor validated. In TypeScript, calling this function
   * will fail if the provided `value` type is invalid, but in JavaScript environments this function
   * should be used with extra caution.
   *
   * @param name
   * @param value
   * @param allowReadOnly
   */
  public setDangerously<A extends AttrIncomingValues<C, R>, K extends keyof A, R extends boolean = false>(name: K, value: A[K], allowReadOnly?: R): this {
    if (!attrRegisteredTypeGuard(this.attrConfigs, name)) {
      throw new AttrUnregisteredError<C>(this, name);
    }
    if (attrValueFnTypeGuard<A[K]>(this.attrConfigs[name].value)) {
      throw new AttrValueFnError<C>(this, name, value);
    }
    if (this.attrConfigs[name].readOnly && !allowReadOnly) {
      throw new AttrReadOnlyError<C>(this, name, value);
    }
    this.attrConfigs[name].value = value;
    return this;
  }

  /**
   * Sets multiple attribute values. If a provided attribute is restricted (is a value function or
   * is marked as `readOnly` and `allowReadOnly` is `false`) then the attribute is silently ignored.
   *
   * @see [[`Entity.set`]]
   * @param attrs
   * @param allowReadOnly
   */
  public fill<A extends AttrIncomingValues<C, R>, R extends boolean = false>(attrs: Partial<A>, allowReadOnly?: R): this {
    (Object.entries(attrs) as Entries<AttrIncomingValues<C, R>>).forEach(([ name, value ]) => { // TODO: Entries<A>
      try {
        this.set(name, value, allowReadOnly);
      } catch (err) {
        // Silently ignore errors when trying to set restricted attributes
        if (!(err instanceof AttrRestrictedError)) {
          throw err;
        }
      }
    });
    return this;
  }

  /**
   * Sets multiple attribute values without normalization nor validation. If a provided attribute is
   * restricted (is a value function or is marked as `readOnly` and `allowReadOnly` is `false`)
   * then the attribute is silently ignored. In TypeScript, calling this function will fail if the
   * provided `attrs` value types are invalid, but in JavaScript environments this function should
   * be used with extra caution.
   *
   * @see [[`Entity.setDangerously`]]
   * @param attrs
   * @param allowReadOnly
   */
  public fillDangerously<A extends AttrIncomingValues<C, R>, R extends boolean = false>(attrs: Partial<A>, allowReadOnly?: R): this {
    (Object.entries(attrs) as Entries<A>).forEach(([ name, value ]) => {
      try {
        this.setDangerously(name, value, allowReadOnly);
      } catch (err) {
        // Silently ignore errors when trying to set restricted attributes
        if (!(err instanceof AttrRestrictedError)) {
          throw err;
        }
      }
    });
    return this;
  }

  /**
   * Returns a string representation of the [[`Entity`]] instance.
   *
   * @see [[`Entity.toJSON`]]
   */
  public toString(): string
  {
    return JSON.stringify(this);
  }

  /**
   * Returns the attribute names and values that should be included when stringifying the
   * [[`Entity`]] instance into JSON form. By default, this means all attributes that are not
   * explicity configured as `hidden`.
   */
  public toJSON(): AttrInferredValues<AttrVisibleConfigs<C>> {
    return this.visible();
  }

  /**
   * Sets multiple attribute values (including values for `readonly` attributes) from JSON data.
   * When using this function, be sure to implement any necessary normalizer functions in your
   * attribute configurations where primitives need to be casted to objects, e.g. where a date
   * string should be cast to a `Date` object.
   *
   * @see [[`Entity.fill`]]
   * @param json
   */
  public fromJSON(json: string): this {
    return this.fill(JSON.parse(json), true);
  }

}
