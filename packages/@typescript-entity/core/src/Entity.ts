import { cloneDeep } from 'lodash';
import { InvalidAttrValueError, UnknownAttrError, UnsanitizableAttrError } from './Errors';
import { Attrs, Configs, HiddenAttrs, NormalizerFn, SanitizerFn, Unsanitized, ValidatorFn, ValueAttrs, ValueConfig, ValueFnConfig, VisibleAttrs, WritableAttrs } from './Types';

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
  constructor(configs: C, attrs: Partial<ValueAttrs<C>> = {}) {
    this.configs = (Object.entries(configs) as Entries<C>).reduce((configs, [ name, config ]) => ({
      ...configs,
      [name]: {
        ...config,
        value: 'function' !== typeof config.value ? cloneDeep(config.value) : config.value,
      },
    }), {}) as C;
    this.fillReadOnly(attrs);
  }

  /**
   * Sanitizes an arbitrary `value` using the configured `sanitizer` function.
   *
   * @param name
   * @param value
   */
  public sanitize<K extends keyof ValueAttrs<C>, V extends ValueAttrs<C>[K]>(name: K, value: unknown): ReturnType<SanitizerFn<V>> {
    if (!(name in this.configs)) {
      throw new UnknownAttrError(this, name);
    }
    const sanitizer = (this.configs[name] as ValueConfig<V>).sanitizer;
    if (undefined === sanitizer) {
      throw new UnsanitizableAttrError(this, name);
    }
    return sanitizer.call(this, value);
  }

  /**
   * Normalizes a non-nullish `value` using the configured `normalizer` function.
   *
   * @param name
   * @param value
   */
  public normalize<K extends keyof ValueAttrs<C>, V extends ValueAttrs<C>[K]>(name: K, value: V): ReturnType<NormalizerFn<V>> {
    if (!(name in this.configs)) {
      throw new UnknownAttrError(this, name);
    }
    const normalizer = (this.configs[name] as ValueConfig<V>).normalizer;
    return (undefined !== value && null !== value && undefined !== normalizer)
      ? normalizer.call(this, value as NonNullable<V>)
      : value;
  }

  /**
   * Validates a non-nullish `value` using the configured `validator` function.
   *
   * @param name
   * @param value
   */
  public validate<K extends keyof ValueAttrs<C>, V extends ValueAttrs<C>[K]>(name: K, value: V): ReturnType<ValidatorFn<V>> {
    if (!(name in this.configs)) {
      throw new UnknownAttrError(this, name);
    }
    const validator = (this.configs[name] as ValueConfig<V>).validator;
    return (undefined !== value && null !== value && undefined !== validator)
      ? validator.call(this, value as NonNullable<V>)
      : true;
  }

  /**
   * Returns the value of the specified attribute `name`. If the attribute is configured with a
   * value function then the return value of this function is returned.
   *
   * @param name
   */
  public get<K extends keyof Attrs<C>, V extends Attrs<C>[K]>(name: K): V {
    if (!(name in this.configs)) {
      throw new UnknownAttrError(this, name);
    }
    return 'function' === typeof this.configs[name]['value']
      ? (this.configs[name] as ValueFnConfig<V>).value.call(this)
      : (this.configs[name] as ValueConfig<V>).value;
  }

  /**
   * Returns the values of the specified attribute `names`.
   *
   * @param names
   */
  public some<K extends keyof Attrs<C>>(names: K[]): Partial<Attrs<C>> {
    return names.reduce((attrs, name) => ({
      ...attrs,
      [name]: this.get(name),
    }), {});
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
    return this.some(Object.keys(this.configs)
      .filter((name) => this.configs[name].hidden)) as HiddenAttrs<C>;
  }

  /**
   * Returns the values of the attributes not configured as `hidden`.
   */
  public visible(): VisibleAttrs<C> {
    return this.some(Object.keys(this.configs)
      .filter((name) => !this.configs[name].hidden)) as VisibleAttrs<C>;
  }

  /**
   * Sets the `value` for the specified attribute `name`. The `value` provided will be normalized
   * and validated. If validation fails an error is thrown and the attribute remains unmodified.
   * Values for `readOnly` attributes can be provided if `allowReadOnly` is set to `true`.
   *
   * @param name
   * @param value
   */
  public set<K extends keyof WritableAttrs<C>, V extends WritableAttrs<C>[K]>(name: K, value: V): this {
    return this.setReadOnly(name, value as ValueAttrs<C>[K]); // TODO: Unsure why value needs type assertion
  }

  protected setReadOnly<K extends keyof ValueAttrs<C>, V extends ValueAttrs<C>[K]>(name: K, value: V): this {
    if (!(name in this.configs)) {
      throw new UnknownAttrError(this, name);
    }
    value = this.normalize(name, value);
    if (!this.validate(name, value)) {
      throw new InvalidAttrValueError(this, name, value);
    }
    (this.configs[name] as ValueConfig<V>).value = value;
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
   */
  public setRaw<K extends keyof Unsanitized<WritableAttrs<C>>, V extends Unsanitized<WritableAttrs<C>>[K]>(name: K, value: V): this {
    return this.setRawReadOnly(name, value);
  }

  protected setRawReadOnly<K extends keyof Unsanitized<ValueAttrs<C>>, V extends Unsanitized<ValueAttrs<C>>[K]>(name: K, value: V): this {
    return this.setReadOnly(name, this.sanitize(name, value));
  }

  /**
   * Sets multiple attribute values from the provided `attrs`. The values provided will be
   * normalized and validated. If validation fails an error is thrown and the attribute - and any
   * subsequent attributes - remain unchanged. Values for `readOnly` attributes can be provided if
   * `allowReadOnly` is set to `true`.
   *
   * @param attrs
   */
  public fill(attrs: Partial<WritableAttrs<C>>): this {
    return this.fillReadOnly(attrs as Partial<ValueAttrs<C>>); // TODO: Unsure why attrs needs type assertion
  }

  /**
   *
   * @param attrs
   */
  protected fillReadOnly(attrs: Partial<ValueAttrs<C>>): this {
    // Cannot assert as Entries<Partial<...>> since TS will (correctly) complain that values may be
    // undefined, but we're mitigating against this by ignoring undefined values
    (Object.entries(attrs) as Entries<ValueAttrs<C>>)
      .forEach(([ name, value ]) => {
        if (undefined !== value) {
          // Prevent abuse of Partial<> allowing non-undefinable attributes to be set to undefined
          // https://github.com/microsoft/TypeScript/issues/13195
          // https://github.com/microsoft/TypeScript/issues/26438
          this.setReadOnly(name, value);
        }
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
   */
  public fillRaw(attrs: Partial<Unsanitized<WritableAttrs<C>>>): this {
    return this.fillRaw(attrs);
  }

  /**
   * Sets multiple attribute values of arbitrary types from the provided `attrs`. The values
   * provided will be sanitized, normalized and validated. If validation fails an error is thrown
   * and the attribute - and any subsequent attributes - remain unchanged. Values for `readOnly`
   * attributes can be provided if `allowReadOnly` is set to `true`.
   *
   * @param attrs
   */
  protected fillRawReadOnly(attrs: Partial<Unsanitized<ValueAttrs<C>>>): this {
    (Object.entries(attrs) as Entries<Partial<Unsanitized<ValueAttrs<C>>>>)
      .forEach(([ name, value ]) => {
        // Prevent abuse of Partial<> allowing non-undefinable attributes to be set to undefined
        // https://github.com/microsoft/TypeScript/issues/13195
        // https://github.com/microsoft/TypeScript/issues/26438
        if (undefined !== value) {
          this.setRawReadOnly(name, value);
        }
      });
    return this;
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
  public fillJSON(json: string): this {
    return this.fillRawReadOnly(
      Object.entries(JSON.parse(json))
        .filter(([ name ]) => (
          'string' === typeof name
          && name in this.configs
          && 'function' !== typeof this.configs[name]['value']
        ))
        .reduce((attrs, [ name, value ]) => ({
          ...attrs,
          [name]: value,
        }), {})
    );
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
