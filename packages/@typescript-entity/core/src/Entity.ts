import { cloneDeep } from 'lodash';
import { InvalidAttrValueError } from './Error';
import { Attrs, Configs, EntityConstructorAttrs, FillableAttrs, FnConfig, HiddenAttrs, NormalizerFn, SanitizerFn, UnsanitizedAttrs, ValidatorFn, ValueAttrs, ValueConfig, VisibleAttrs, WritableAttrs } from './Type';

type Entries<T> = { [K in keyof T]: [ K, T[K] ] }[keyof T][];

export default abstract class Entity<C extends Configs> {

  protected configs: C;

  /**
   * Creates a new [[`Entity`]] instance. The attribute `configs` define the attributes available on
   * the [[`Entity`]] instance along with default values for any required attributes. Initial values
   * (including values for `readOnly` attributes) can be provided in `attrs`.
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
   * Sanitizes an arbitrary `value` using the configured `sanitizer` function.
   *
   * @param name
   * @param value
   */
  public sanitize<K extends keyof ValueAttrs<C>, T extends ValueAttrs<C>[K]>(name: K, value: unknown): ReturnType<SanitizerFn<T>> {
    return (this.configs[name].sanitizer as SanitizerFn<T>).call(this, value);
  }

  /**
   * Normalizes a non-nullish `value` using the configured `normalizer` function.
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
   * Validates a non-nullish `value` using the configured `validator` function.
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
   * Returns the values of the specified attribute `names`.
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
   * Returns all attribute values.
   */
  public all(): Attrs<C> {
    return this.some(Object.keys(this.configs)) as Attrs<C>;
  }

  /**
   * Returns the values of the attributes configured as `hidden`.
   */
  public hidden(): HiddenAttrs<C> {
    return this.some(Object.keys(this.configs).filter((name) => this.configs[name].hidden)) as HiddenAttrs<C>;
  }

  /**
   * Returns the values of the attributes not configured as `hidden`.
   */
  public visible(): VisibleAttrs<C> {
    return this.some(Object.keys(this.configs).filter((name) => !this.configs[name].hidden)) as VisibleAttrs<C>;
  }

  /**
   * Sets the `value` for the specified attribute `name`. The `value` provided will be normalized
   * and validated. If validation fails an error is thrown and the attribute remains unmodified.
   * Values for `readOnly` attributes can be provided if `allowReadOnly` is set to `true`.
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
   * Sets the `value` of an arbitrary type for the specified attribute `name`. The `value` provided
   * will be sanitized, normalized and validated. If validation fails an error is thrown and the
   * attribute remains unmodified. Values for `readOnly` attributes can be provided if
   * `allowReadOnly` is set to `true`.
   *
   * @param name
   * @param value
   * @param allowReadOnly
   */
  public setRaw<K extends keyof FillableAttrs<C, R>, T extends FillableAttrs<C, R>[K], R extends boolean = false>(name: K, value: unknown, allowReadOnly?: R): this {
    return this.set(name, (this.configs[name as keyof C] as ValueConfig<T>).sanitizer.call(this, value), allowReadOnly);
  }

  /**
   * Sets multiple attribute values from the provided `attrs`. The values provided will be
   * normalized and validated. If validation fails an error is thrown and the attribute - and any
   * subsequent attributes - remain unchanged. Values for `readOnly` attributes can be provided if
   * `allowReadOnly` is set to `true`.
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
   * Sets multiple attribute values of arbitrary types from the provided `attrs`. The values
   * provided will be sanitized, normalized and validated. If validation fails an error is thrown
   * and the attribute - and any subsequent attributes - remain unchanged. Values for `readOnly`
   * attributes can be provided if `allowReadOnly` is set to `true`.
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
   * Sets multiple attribute values of arbitrary types from the provided `json` string. The values
   * provided will be sanitized, normalized and validated. If validation fails an error is thrown
   * and the attribute - and any subsequent attributes - remain unchanged. Values for `readOnly`
   * attributes can be provided if `allowReadOnly` is set to `true`. Values for unregistered
   * attributes, and those configured with value functions, are ignored.
   *
   * @param json
   */
  public fillJSON(json: string, allowReadOnly = false): this {
    const attrs = Object.entries(JSON.parse(json))
      .filter(([ name ]) => name in this.configs && 'value' in this.configs[name] && (!this.configs[name].readOnly || allowReadOnly))
      .reduce((attrs, [ name, value ]) => ({
        ...attrs,
        [name]: value,
      }), {});
    return this.fillRaw(attrs, allowReadOnly);
  }

  /**
   * Returns a string representation of the [[`Entity`]] instance.
   *
   * @see [[`Entity.toJSON()`]]
   */
  public toString(): string
  {
    return JSON.stringify(this);
  }

  /**
   * Returns the attributes to be included when stringifying this instance to JSON form.
   *
   * @see [[`Entity.visible()`]]
   */
  public toJSON(): VisibleAttrs<C> {
    return this.visible();
  }

}
