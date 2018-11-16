import { Config, Modelable } from './interfaces';
import { Attributes, Constructor, Sanitizers, Validators } from './types';

export default abstract class Model<C extends Config = Config> implements Modelable<C> {

  public ['constructor']: Constructor<this, C>;
  public readonly config: C;

  public static config: Config = {};
  public static sanitizers: Sanitizers<Model> = {};
  public static validators: Validators<Model> = {};

  /**
   * @param config
   */
  public constructor(config: C = Model.config as C) {
    this.config = config;
    Object.defineProperty(this, 'config', {
      enumerable: false,
    });
  }

  /**
   * Sanitizes all attributes on the model.
   */
  public sanitize(): this {

    type A = Attributes<this>;
    type K = keyof A;

    (Object.keys(this.constructor.sanitizers) as K[]).forEach((key) => {
      (this[key] as A[K]) = this.sanitizeValue(key, this[key]);
    });

    return this;

  }

  /**
   * Returns a sanitized `value` for the given `key`.
   *
   * @param key
   * @param value
   */
  public sanitizeValue<K extends keyof Attributes<this>>(key: K, value: any): Attributes<this>[K] {
    return this.constructor.sanitizers[key] ? this.constructor.sanitizers[key]!(this, key, value) : value;
  }

  /**
   * Validates all attributes on the model. An error is thrown if anything fails
   * validation.
   */
  public validate(): this {

    (Object.keys(this.constructor.validators) as (keyof Validators<this>)[]).forEach((key) => {
      this.validateValue(key, this[key]);
    });

    return this;

  }

  /**
   * Validates a `value` for the given `key`. An error is thrown either by the
   * validator function itself, or a generic `TypeError` is thrown if the
   * validator function returns falsey.
   *
   * @param key
   * @param value
   */
  public validateValue<K extends keyof Attributes<this>>(key: K, value: any): true {
    if (undefined !== this.constructor.validators[key] && !this.constructor.validators[key]!(this, key, value)) {
      throw new TypeError(`Invalid value provided for ${this.constructor.name}.${key}: ${value}`);
    }
    return true;
  }

  /**
   * Sanitizes and validates all attributes on the model.
   */
  public clean() {
    return this.sanitize().validate();
  }

  /**
   * Merges an arbitrary set of attributes into the model then cleans it up.
   * Useful for hydrating a model from user provided data or JSON from an
   * untrusted source.
   *
   * @param attrs
   * @param keys
   */
  public merge(attrs: Partial<Attributes<this>>, keys?: (keyof Attributes<this>)[]): this {
    return this.mergeRaw(attrs, keys).clean();
  }

  /**
   * Merges an arbitrary set of attributes into the model without cleaning. Only
   * use this if you are certain the object contains clean data.
   *
   * @param attrs
   * @param keys
   */
  public mergeRaw(attrs: Partial<Attributes<this>>, keys?: (keyof Attributes<this>)[]): this {

    if (undefined === keys) {
      keys = Object.keys(this.constructor.sanitizers).concat(Object.keys(this.constructor.validators)).filter((elem, pos, arr) => arr.indexOf(elem) === pos) as (keyof Attributes<this>)[];
    }

    type A = Attributes<this>;
    type K = keyof A;

    keys.forEach((key) => {
      if (undefined !== attrs[key]) {
        (this[key] as A[K]) = attrs[key] as A[K];
      }
    });

    return this;

  }

  /**
   * Include attributes defined by getters when stringifying the model to JSON.
   */
  public toJSON() {

    const prototype = Object.getPrototypeOf(this);
    const json: any = Object.assign({}, this);

    Object.getOwnPropertyNames(prototype).forEach((key) => {
      let descriptor = Object.getOwnPropertyDescriptor(prototype, key);
      if (descriptor && 'function' === typeof descriptor.get) {
        json[key] = this[key as keyof this];
      }
    });

    return json;

  }

}
