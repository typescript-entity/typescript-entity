import { cloneDeep } from 'lodash';
import { InvalidAttrValueError } from './Error';
import { Attrs, Configs, EntityConstructorAttrs, FillableAttrs, FnConfig, HiddenAttrs, NormalizerFn, SanitizerFn, UnsanitizedAttrs, ValidatorFn, ValueAttrs, ValueConfig, VisibleAttrs, WritableAttrs } from './Type';

type Entries<T> = { [K in keyof T]: [ K, T[K] ] }[keyof T][];

export default abstract class Entity<C extends Configs> {

  protected configs: C;

  /**
   * Creates a new [[`Entity`]] instance. The `attrConfigs` defines the attributes available on the
   * [[`Entity`]] instance along with default values for required attributes. Initial attribute
   * values (including values for `readonly` attributes) can be provided in `attrs`.
   *
   * @param configs
   * @param attrs
   */
  constructor(configs: C, attrs: EntityConstructorAttrs<C> = {}) {
    this.configs = (Object.entries(configs) as Entries<C>).reduce((configs, [ name, config ]) => ({
      ...configs,
      [name]: {
        ...config,
        ...('value' in config ? { value: cloneDeep(config.value) } : {}),
      },
    }), {}) as C;
    this.fill(attrs, true);
  }

  /**
   * Sanitizes a value using the sanitizer function provided in the attribute configs. This function
   * should be used when handling attributes values where type assurance is not guaranteed.
   *
   * @param name
   * @param value
   */
  public sanitize<K extends keyof ValueAttrs<C>, T extends ValueAttrs<C>[K]>(name: K, value: unknown): ReturnType<SanitizerFn<T>> {
    return (this.configs[name].sanitizer as SanitizerFn<T>).call(this, value);
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
  public normalize<K extends keyof ValueAttrs<C>, T extends ValueAttrs<C>[K]>(name: K, value: T): ReturnType<NormalizerFn<T>> {
    return (undefined !== value && null !== value && 'function' === typeof this.configs[name].normalizer)
      ? (this.configs[name].normalizer as NormalizerFn<T>).call(this, value)
      : value;
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
  public validate<K extends keyof ValueAttrs<C>, T extends ValueAttrs<C>[K]>(name: K, value: T): ReturnType<ValidatorFn<T>> {
    return (undefined !== value && null !== value && 'function' === typeof this.configs[name].validator)
      ? (this.configs[name].validator as ValidatorFn<T>).call(this, value)
      : true;
  }

  /**
   * Returns the value of the specified attribute `name`. If the attribute is configured with a
   * value function then the return value of this function is returned.
   *
   * @param name
   */
  public get<K extends keyof Attrs<C>, T extends Attrs<C>[K]>(name: K): T {
    return 'fn' in this.configs[name]
      ? (this.configs[name] as FnConfig<T>).fn.call(this)
      : (this.configs[name] as ValueConfig<T>).value;
  }

  /**
   * Returns the values of the specified attribute `names`. If an attribute is configured with a
   * value function then the return value of this function is returned.
   *
   * @param names
   */
  public some(names: (keyof Attrs<C>)[]): Partial<Attrs<C>> {
    return names.reduce((attrs, name) => ({
      ...attrs,
      [name]: this.get(name),
    }), {}) as Partial<Attrs<C>>;
  }

  /**
   * Returns all attributes.
   */
  public all(): Attrs<C> {
    return this.some(Object.keys(this.configs)) as Attrs<C>;
  }

  /**
   * Returns all attributes configured as `hidden`.
   */
  public hidden(): HiddenAttrs<C> {
    return this.some(Object.keys(this.configs).filter((name) => this.configs[name].hidden)) as HiddenAttrs<C>;
  }

  /**
   * Returns all attributes not configured as `hidden`.
   */
  public visible(): VisibleAttrs<C> {
    return this.some(Object.keys(this.configs).filter((name) => !this.configs[name].hidden)) as VisibleAttrs<C>;
  }

  /**
   * Sets the `value` of the specified attribute `name`. If the attribute is configured with a value
   * function, or is `readOnly` and `allowReadOnly` is `false`, then an error is thrown. The `value`
   * provided will be normalized and validated. If validation fails an error is thrown and the
   * attribute remains unmodified.
   *
   * @param name
   * @param value
   * @param allowReadOnly
   */
  public set<K extends keyof FillableAttrs<C, R>, T extends FillableAttrs<C, R>[K], R extends boolean = false>(name: K, value: T, allowReadOnly?: R): this {
    const resolvedName = allowReadOnly ? name as unknown as keyof ValueAttrs<C> : name as unknown as keyof WritableAttrs<C>;
    const config = this.configs[resolvedName];
    value = this.normalize(resolvedName, value);
    if (!this.validate(resolvedName, value)) {
      throw new InvalidAttrValueError(this, resolvedName, value);
    }
    config.value = value;
    return this;
  }

  /**
   * Sets the `value` of the specified attribute `name`. If the attribute is configured with a value
   * function, or is `readOnly` and `allowReadOnly` is `false`, then an error is thrown. The `value`
   * provided will be sanitized, normalized and validated. If validation fails an error is thrown
   * and the attribute remains unmodified.
   *
   * @param name
   * @param value
   * @param allowReadOnly
   */
  public setRaw<K extends keyof FillableAttrs<C, R>, T extends FillableAttrs<C, R>[K], R extends boolean = false>(name: K, value: unknown, allowReadOnly?: R): this {
    return this.set(name, (this.configs[name as keyof C] as ValueConfig<T>).sanitizer.call(this, value), allowReadOnly);
  }

  /**
   * Sets the values for the specified `attrs` key/value pairs. The values provided will be
   * normalized and validated. If validation fails an error is thrown and the affected attribute and
   * any remaining attributes remain unmodified.
   *
   * @param attrs
   * @param allowReadOnly
   */
  public fill<R extends boolean = false>(attrs: Partial<FillableAttrs<C, R>>, allowReadOnly?: R): this {
    (Object.entries(attrs) as Entries<FillableAttrs<C, R>>).forEach(([ name, value ]) => {
      this.set(name, value, allowReadOnly);
    });
    return this;
  }

  /**
   * Sets the values for the specified `attrs` key/value pairs. If an attribute is configured with a
   * value function, or is `readOnly` and `allowReadOnly` is `false`, then the attribute is ignored.
   * The values provided will be sanitized, normalized and validated. If validation fails an error
   * is thrown and the affected attribute and any remaining attributes remain unmodified.
   *
   * @param attrs
   * @param allowReadOnly
   */
  public fillRaw<R extends boolean = false>(attrs: Partial<UnsanitizedAttrs<C, R>>, allowReadOnly?: R): this {
    const sanitized: Partial<FillableAttrs<C, R>> = (Object.entries(attrs) as Entries<UnsanitizedAttrs<C, R>>).reduce((attrs, [ name, value ]) => {
      const resolvedName = allowReadOnly ? name as unknown as keyof ValueAttrs<C> : name as unknown as keyof WritableAttrs<C>;
      return {
        ...attrs,
        [resolvedName]: this.sanitize(resolvedName, value),
      };
    }, {});
    return this.fill(sanitized, allowReadOnly);
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
   * Returns the attributes to be included when stringifying this instance to JSON form.
   *
   * @see [[`Entity.visible`]]
   */
  public toJSON(): VisibleAttrs<C> {
    return this.visible();
  }

  /**
   * Imports attributes from a JSON string. Removes unregistered attributes and those configured
   * with value functions before sanitizing, normalizing and validating incoming values.
   *
   * @see [[`Entity.fillRaw`]]
   * @param json
   */
  public fromJSON(json: string): this {
    const attrs = Object.entries(JSON.parse(json))
      .filter(([ name ]) => name in this.configs && 'value' in this.configs[name])
      .reduce((attrs, [ name, value ]) => ({
        ...attrs,
        [name]: value,
      }), {});
    return this.fillRaw(attrs, true);
  }

}
