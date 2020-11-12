import { cloneDeep } from 'lodash';
import { FnAttrError } from '../error/FnAttrError';
import { NormalizationError } from '../error/NormalizationError';
import { ReadOnlyError } from '../error/ReadOnlyError';
import { SanitizationError } from '../error/SanitizationError';
import { UnconfiguredAttrError } from '../error/UnconfiguredAttrError';
import { ValidationError } from '../error/ValidationError';

type Entries<T> = {
  [K in keyof T]: [ K, T[K] ];
}[keyof T][];

export interface EntityConstructor<T extends Entity> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new(...args: any[]): T;
  prototype: T;
}

export type Configs = Record<Name, ValueConfig | FnConfig>;

export interface ValueConfig<T extends Value = Value> {
  hidden?: boolean;
  normalizer?: NormalizerFn<T>;
  readOnly?: boolean;
  sanitizer: SanitizerFn<T>;
  validator?: ValidatorFn<T>;
  value: T;
}

export interface FnConfig<T extends Value = Value> {
  hidden?: boolean;
  fn: Fn<T>;
}

export type Name = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Value = any;

export type Fn<T extends Value = Value> = () => T;

export type SanitizerFn<T extends Value = Value> = (value: unknown) => T;

export type NormalizerFn<T extends Value = Value> = (value: NonNullable<T>) => T;

export type ValidatorFn<T extends Value = Value> = (value: NonNullable<T>) => boolean;

export type Attrs<T extends Configs> = {
  [K in keyof T]: Attr<T, K>;
};

export type Attr<T extends Configs, K extends keyof T> = T[K] extends FnConfig ? ReturnType<T[K]['fn']> : T[K] extends ValueConfig ? T[K]['value'] : never;

export type ValueAttrs<T extends Configs> = Attrs<Pick<T, {
  [K in keyof T]: T[K] extends ValueConfig ? K : never;
}[keyof T]>>;

export type FnAttrs<T extends Configs> = Attrs<Pick<T, {
  [K in keyof T]: T[K] extends FnConfig ? K : never;
}[keyof T]>>;

export type HiddenAttrs<T extends Configs> = Attrs<Pick<T, {
  [K in keyof T]: T[K]['hidden'] extends true ? K : never;
}[keyof T]>>;

export type VisibleAttrs<T extends Configs> = Attrs<Pick<T, {
  [K in keyof T]: T[K]['hidden'] extends true ? never : K;
}[keyof T]>>;

export type ReadOnlyAttrs<T extends Configs> = Pick<ValueAttrs<T>, {
  [K in keyof ValueAttrs<T>]: T[K] extends ValueConfig ? T[K]['readOnly'] extends true ? K : never : never;
}[keyof ValueAttrs<T>]>;

export type WritableAttrs<T extends Configs> = Omit<ValueAttrs<T>, keyof ReadOnlyAttrs<T>>;

export type InitialAttrs<T extends Configs> = Partial<ValueAttrs<T>>;

const isFnConfig = <T extends Value>(config: ValueConfig<T> | FnConfig<T>): config is FnConfig<T> => 'fn' in config;

const isValueConfig = <T extends Value>(config: ValueConfig<T> | FnConfig<T>): config is ValueConfig<T> => 'value' in config;

export abstract class Entity<C extends Configs = Configs> {

  protected _configs = new Map<keyof C, ValueConfig | FnConfig>();

  // TODO: This should really be typed as `Set<keyof WritableAttrs<C>>` but because `C` defaults to
  // `Configs` and `keyof WritableAttrs<Configs>` resolves to `never`, instances of `Entity<C>` -
  // where `C` is a non-empty configuration type - can never be compared to Entity<Configs>.
  protected _modified = new Set<keyof C>();

  /**
   * Creates a new [[`Entity`]] instance. The attribute `configs` define the attributes available on
   * the [[`Entity`]] instance along with a default `value` for all required attributes. Default
   * values are not sanitized, normalized nor validated. Values provided via `attrs` are normalized
   * and validated, and may also include values for `readOnly` attributes.
   *
   * @param configs
   * @param attrs
   */
  public constructor(configs: C, attrs: InitialAttrs<C> = {}) {
    (Object.entries(configs) as Entries<C>).forEach(([ name, config ]) => {
      if (isValueConfig(config)) {
        this._configs.set(name, {
          ...config,
          value: cloneDeep(config.value),
        });
      } else {
        this._configs.set(name, config);
      }
    });

    this
      .fill(attrs)
      .clearModified();

    this._configs.forEach((config) => {
      if (isValueConfig(config) && config.readOnly) {
        Object.defineProperty(config, 'value', { writable: false });
      }
    });
  }

  /**
   * Returns the configuration for the attribute named `name`.
   *
   * @param name
   */
  protected _config(name: keyof C): ValueConfig | FnConfig {
    const config = this._configs.get(name);
    if (undefined === config) {
      throw new UnconfiguredAttrError(this, name);
    }
    return config;
  }

  /**
   * Sanitizes an arbitrary `value` using the configured `sanitizer` function for the specified
   * attribute `name`. The function will be called with the entity instance bound to `this`.
   *
   * @param name
   * @param value
   */
  public sanitize<K extends keyof ValueAttrs<C>, V extends ValueAttrs<C>[K]>(name: K, value: unknown): ReturnType<NormalizerFn<V>> {
    const config = this._config(name);
    if (isFnConfig(config)) {
      throw new FnAttrError(this, name, 'Function attributes cannot be sanitized.');
    }
    try {
      return config.sanitizer.call(this, value);
    } catch (err) {
      throw err instanceof SanitizationError
        ? err
        : new SanitizationError(this, name, value, undefined, err);
    }
  }

  /**
   * Normalizes a non-nullish `value` using the configured `normalizer` function for the specified
   * attribute `name`. If a normalizer function has not been configured then the `value` is returned
   * as-is. The function will be called with the entity instance bound to `this`.
   *
   * @param name
   * @param value
   */
  public normalize<K extends keyof ValueAttrs<C>, V extends ValueAttrs<C>[K]>(name: K, value: V): ReturnType<NormalizerFn<V>> {
    const config = this._config(name);
    if (isFnConfig(config)) {
      throw new FnAttrError(this, name, 'Function attributes cannot be normalized.');
    }
    try {
      return (undefined !== value && null !== value && undefined !== config.normalizer)
        ? config.normalizer.call(this, value)
        : value;
    } catch (err) {
      throw err instanceof NormalizationError
        ? err
        : new NormalizationError(this, name, value, undefined, err);
    }
  }

  /**
   * Validates a non-nullish `value` using the configured `validator` function for the specified
   * attribute `name`. If a validator function has not been configured, or returns a truthy value
   * then `true` is returned. If it returns a falsey value then a `ValidationError` is thrown unless
   * `throws` is set to `false` in which case `false` is returned. The validator function will be
   * called with the entity instance bound to `this`.
   *
   * @param name
   * @param value
   */
  public validate<K extends keyof ValueAttrs<C>, V extends ValueAttrs<C>[K]>(name: K, value: V, throws = true): ReturnType<ValidatorFn<V>> {
    const config = this._config(name);
    if (isFnConfig(config)) {
      throw new FnAttrError(this, name, 'Function attributes cannot be validated.');
    }
    try {
      if (
        undefined === value
        || null === value
        || undefined === config.validator
        || config.validator.call(this, value)
      ) {
        return true;
      }
      throw new ValidationError(this, name, value);
    } catch (err) {
      if (throws) {
        throw err instanceof ValidationError
          ? err
          : new ValidationError(this, name, value, undefined, err);
      }
    }
    return false;
  }

  /**
   * Validates multiple attributes.
   *
   * @param names
   * @param value
   */
  public validateMany(names: (keyof ValueAttrs<C>)[], throws = true): boolean {
    return !!(Object.entries(this.many(names)) as Entries<ValueAttrs<C>>)
      .find(([ name, value ]) => !this.validate(name, value, throws));
  }

  /**
   * Validates all writable attributes. Particularly useful for validating state before persisting.
   *
   * @param throws
   */
  public validateWritable(throws = true): boolean {
    return !!(Object.entries(this.writable()) as Entries<WritableAttrs<C>>)
      .find(([ name, value ]) => !this.validate(name, value, throws));
  }

  /**
   * Returns the value of the specified attribute `name`. If the attribute is configured as a value
   * function then this function is executed and the resulting value is returned. The function will
   * be called with the entity instance bound to `this`.
   *
   * @param name
   */
  public one<K extends keyof Attrs<C>, V extends Attrs<C>[K]>(name: K): V {
    const config = this._config(name);
    return isFnConfig(config) ? config.fn.call(this) : config.value;
  }

  /**
   * Returns the attributes included in `names`.
   *
   * @param names
   */
  public many<K extends keyof Attrs<C>>(names: K[]): Partial<Attrs<C>> {
    return names.reduce((attrs, name) => ({
      ...attrs,
      [name]: this.one(name),
    }), {});
  }

  /**
   * Returns all attributes.
   */
  public all(): Attrs<C> {
    return this.many(Array.from(this._configs.keys())) as Attrs<C>;
  }

  /**
   * Returns the attributes configured as `hidden`.
   */
  public hidden(): HiddenAttrs<C> {
    return this.many(
      Array.from(this._configs.entries())
        .filter(([ , config ]) => config.hidden)
        .map(([ name ]) => name)
    ) as HiddenAttrs<C>;
  }

  /**
   * Returns the attributes not configured as `hidden`.
   */
  public visible(): VisibleAttrs<C> {
    return this.many(
      Array.from(this._configs.entries())
        .filter(([ , config ]) => !config.hidden)
        .map(([ name ]) => name)
    ) as VisibleAttrs<C>;
  }

  /**
   * Returns value attributes that are configured as `readOnly`.
   */
  public readOnly(): ReadOnlyAttrs<C> {
    return this.many(
      Array.from(this._configs.entries())
        .filter(([ , config ]) => isValueConfig(config) && config.readOnly)
        .map(([ name ]) => name)
    ) as ReadOnlyAttrs<C>;
  }

  /**
   * Returns value attributes that are not configured as `readOnly`.
   */
  public writable(): WritableAttrs<C> {
    return this.many(
      Array.from(this._configs.entries())
        .filter(([ , config ]) => isValueConfig(config) && !config.readOnly)
        .map(([ name ]) => name)
    ) as WritableAttrs<C>;
  }

  /**
   * Returns the attributes that have been modified since instantiation.
   *
   * @param name
   */
  public modified(): Partial<WritableAttrs<C>> {
    return this.many(Array.from(this._modified.values()));
  }

  /**
   * Marks all attributes as unmodified.
   *
   * @param name
   */
  public clearModified(): this {
    this._modified.clear();
    return this;
  }

  /**
   * Sets the `value` for the specified attribute `name`. The `value` provided will be sanitized,
   * normalized and validated. If validation fails a `ValidationError` is thrown and the attribute
   * remains unmodified.
   *
   * @param name
   * @param value
   */
  public set<K extends keyof WritableAttrs<C>, V extends WritableAttrs<C>[K]>(name: K, value: V): this {
    const config = this._config(name);
    if (isFnConfig(config)) {
      throw new FnAttrError(this, name, 'Function attributes cannot be modified.');
    }
    const descriptor = Object.getOwnPropertyDescriptor(config, 'value');
    if (descriptor && !descriptor.writable) {
      throw new ReadOnlyError(this, name, value);
    }
    value = this.normalize(name, this.sanitize(name, value));
    this.validate(name, value);
    if (this.one(name) !== value) {
      config.value = value;
      this._modified.add(name);
    }
    return this;
  }

  /**
   * Sets multiple attributes using the provided `attrs` by calling [[`Entity.set`]]. Unknown or
   * function attributes are silently ignored.
   *
   * @param attrs
   */
  public fill(attrs: Partial<WritableAttrs<C>>): this {
    if (attrs instanceof Entity) {
      attrs = attrs.all() as Partial<WritableAttrs<C>>;
    } else if ('object' !== typeof attrs || null === attrs) {
      attrs = {};
    }
    (Object.entries(attrs) as Entries<WritableAttrs<C>>)
      .forEach(([ name, value ]) => {
        // Prevent abuse of Partial which allows setting required attributes to undefined
        // https://github.com/microsoft/TypeScript/issues/13195
        // https://github.com/microsoft/TypeScript/issues/26438
        if (undefined === value) {
          return;
        }
        let config: ValueConfig | FnConfig;
        try {
          config = this._config(name);
        } catch (err) {
          return;
        }
        if (isFnConfig(config)) {
          return;
        }
        this.set(name, value);
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
   * Returns the attributes to be included when stringifying an instance to JSON form.
   *
   * @see [[`Entity.visible`]]
   */
  public toJSON(): VisibleAttrs<C> {
    return this.visible();
  }

}
