import { cloneDeep } from 'lodash';
import { InvalidAttrValueError, UnknownAttrError, UnsanitizableAttrError } from './Errors';
import { Attrs, Config, Configs, FnConfig, HiddenAttrs, NormalizerFn, SanitizerFn, Unsanitized, ValidatorFn, ValueAttrs, VisibleAttrs, WritableAttrs } from './Types';

type Entries<T> = { [K in keyof T]: [ K, T[K] ] }[keyof T][];

export default abstract class Entity<C extends Configs> {

  protected configs: C;

  /**
   * Creates a new [[`Entity`]] instance. The attribute `configs` define the attributes available on
   * the [[`Entity`]] instance along with a default `value` for all required attributes. Default
   * values are not sanitized, normalized nor validated. Values provided via `attrs` are normalized
   * and validated, and may also include values for `readOnly` attributes.
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
   * Sanitizes an arbitrary `value` using the configured `sanitizer` function for the specified
   * attribute `name`. The function will be called with the entity instance bound to `this`.
   *
   * @param name
   * @param value
   */
  public sanitize<K extends keyof ValueAttrs<C>, V extends ValueAttrs<C>[K]>(name: K, value: unknown): ReturnType<SanitizerFn<V>> {
    if (!(name in this.configs)) {
      throw new UnknownAttrError(this, name);
    }
    const sanitizer = (this.configs[name] as Config<V>).sanitizer;
    if (undefined === sanitizer) {
      throw new UnsanitizableAttrError(this, name);
    }
    return sanitizer.call(this, value);
  }

  /**
   * Normalizes an non-nullish `value` using the configured `normalizer` function for the specified
   * attribute `name`. If a normalizer function has not been configured then the `value` is returned
   * as-is. The function will be called with the entity instance bound to `this`.
   *
   * @param name
   * @param value
   */
  public normalize<K extends keyof ValueAttrs<C>, V extends ValueAttrs<C>[K]>(name: K, value: V): ReturnType<NormalizerFn<V>> {
    if (!(name in this.configs)) {
      throw new UnknownAttrError(this, name);
    }
    const normalizer = (this.configs[name] as Config<V>).normalizer;
    return (undefined !== value && null !== value && undefined !== normalizer)
      ? normalizer.call(this, value as NonNullable<V>)
      : value;
  }

  /**
   * Validates an non-nullish `value` using the configured `validator` function for the specified
   * attribute `name`. If a validator function has not been configured then `true` is returned. The
   * function will be called with the entity instance bound to `this`.
   *
   * @param name
   * @param value
   */
  public validate<K extends keyof ValueAttrs<C>, V extends ValueAttrs<C>[K]>(name: K, value: V): ReturnType<ValidatorFn<V>> {
    if (!(name in this.configs)) {
      throw new UnknownAttrError(this, name);
    }
    const validator = (this.configs[name] as Config<V>).validator;
    return (undefined !== value && null !== value && undefined !== validator)
      ? validator.call(this, value as NonNullable<V>)
      : true;
  }

  /**
   * Returns the value of the specified attribute `name`. If the attribute is configured as a value
   * function then this function is executed and the resulting value is returned. The function will
   * be called with the entity instance bound to `this`.
   *
   * @param name
   */
  public get<K extends keyof Attrs<C>, V extends Attrs<C>[K]>(name: K): V {
    if (!(name in this.configs)) {
      throw new UnknownAttrError(this, name);
    }
    return 'function' === typeof this.configs[name]['value']
      ? (this.configs[name] as FnConfig<V>).value.call(this)
      : (this.configs[name] as Config<V>).value;
  }

  /**
   * Returns the attributes included in `names`.
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
   * Returns all attributes.
   */
  public all(): Attrs<C> {
    return this.some(Object.keys(this.configs)) as Attrs<C>;
  }

  /**
   * Returns the attributes configured as `hidden`.
   */
  public hidden(): HiddenAttrs<C> {
    return this.some(Object.keys(this.configs)
      .filter((name) => this.configs[name].hidden)) as HiddenAttrs<C>;
  }

  /**
   * Returns the attributes not configured as `hidden`.
   */
  public visible(): VisibleAttrs<C> {
    return this.some(Object.keys(this.configs)
      .filter((name) => !this.configs[name].hidden)) as VisibleAttrs<C>;
  }

  /**
   * Sets the `value` for the specified attribute `name`. The `value` provided will be normalized
   * and validated. If validation fails an error is thrown and the attribute remains unmodified.
   *
   * @param name
   * @param value
   */
  public set<K extends keyof WritableAttrs<C>, V extends WritableAttrs<C>[K]>(name: K, value: V): this {
    return this.setReadOnly(name, value as ValueAttrs<C>[K]); // TODO: Unsure why value needs type assertion
  }

  /**
   * Like [[`Entity.set`]] but allows overwriting of attributes configured as `readOnly`.
   *
   * @param name
   * @param value
   */
  protected setReadOnly<K extends keyof ValueAttrs<C>, V extends ValueAttrs<C>[K]>(name: K, value: V): this {
    if (!(name in this.configs)) {
      throw new UnknownAttrError(this, name);
    }
    value = this.normalize(name, value);
    if (!this.validate(name, value)) {
      throw new InvalidAttrValueError(this, name, value);
    }
    (this.configs[name] as Config<V>).value = value;
    return this;
  }

  /**
   * Like [[`Entity.set`]] but accepts an arbitrary `value` which will be sanitized first.
   *
   * @param name
   * @param value
   */
  public setRaw<K extends keyof Unsanitized<WritableAttrs<C>>, V extends Unsanitized<WritableAttrs<C>>[K]>(name: K, value: V): this {
    return this.setRawReadOnly(name, value);
  }

  /**
   * Like [[`Entity.setRaw`]] but allows overwriting of attributes configured as `readOnly`.
   *
   * @param name
   * @param value
   */
  protected setRawReadOnly<K extends keyof Unsanitized<ValueAttrs<C>>, V extends Unsanitized<ValueAttrs<C>>[K]>(name: K, value: V): this {
    return this.setReadOnly(name, this.sanitize(name, value));
  }

  /**
   * Sets multiple attributes using the provided `attrs`. The values provided will be normalized and
   * validated. If validation fails an error is thrown and the attribute - and any subsequent
   * attributes - remain unmodified.
   *
   * @param attrs
   */
  public fill(attrs: Partial<WritableAttrs<C>>): this {
    return this.fillReadOnly(attrs as Partial<ValueAttrs<C>>); // TODO: Unsure why attrs needs type assertion
  }

  /**
   * Like [[`Entity.fill`]] but allows overwriting of attributes configured as `readOnly`.
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
   * Like [[`Entity.fill`]] but accepts arbitrary values which will be sanitized first.
   *
   * @param attrs
   */
  public fillRaw(attrs: Partial<Unsanitized<WritableAttrs<C>>>): this {
    return this.fillRaw(attrs);
  }

  /**
   * Like [[`Entity.fillRaw`]] but allows overwriting of attributes configured as `readOnly`.
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
   * Sets multiple attributes from the provided `json` string. Unrecognised attributes, or those
   * that are configured with value functions, are ignored. The remaining attributes are passed to
   * [[`Entity.fillRawReadOnly`]] for sanitization, normalization and validation.
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
   * @see [[`Entity.toJSON`]]
   */
  public toString(): string
  {
    return JSON.stringify(this);
  }

  /**
   * Returns the attributes to be included when stringifying an instance to JSON form.
   *
   * @see [[`Entity.visible`]]
   */
  public toJSON(): VisibleAttrs<C> {
    return this.visible();
  }

}
