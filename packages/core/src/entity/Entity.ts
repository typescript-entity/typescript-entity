import { cloneDeep } from 'lodash';
import { NormalizationError } from '../error/NormalizationError';
import { ReadOnlyError } from '../error/ReadOnlyError';
import { SanitizationError } from '../error/SanitizationError';
import { UnconfiguredAttrError } from '../error/UnconfiguredAttrError';
import { ValidationError } from '../error/ValidationError';

type Entries<T> = {
  [K in keyof T]: [ K, T[K] ];
}[keyof T][];

export interface EntityConstructor<C extends Configs = Configs> {
  new(attrs: InitialAttrs<C>): Entity<C>;
  readonly prototype: Entity<C>;
  readonly configs: C;
  clone<E extends Entity<C>>(entity: E): E;
  fromJSON<E extends Entity<C>>(json: string): E;
}

export type EntityInterface<C extends Configs = Configs> = Attrs<C>;

export interface Configs {
  [name: string]: ValueConfig | FnConfig;
}

export interface ValueConfig<V extends Value = Value> {
  hidden?: boolean;
  normalizer?: NormalizerFn<V>;
  readOnly?: boolean;
  sanitizer: SanitizerFn<V>;
  validator?: ValidatorFn<V>;
  value: V;
}

export interface FnConfig<V extends Value = Value> {
  hidden?: boolean;
  fn: Fn<V>;
}

export type Name = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Value = any;

export type Fn<V extends Value = Value> = () => V;

export type SanitizerFn<V extends Value = Value> = (value: unknown) => V;

export type NormalizerFn<V extends Value = Value> = (value: NonNullable<V>) => V;

export type ValidatorFn<V extends Value = Value> = (value: NonNullable<V>) => boolean;

export type Attrs<C extends Configs> = {
  [K in keyof C]: Attr<C, K>;
};

export type Attr<C extends Configs, K extends keyof C> = C[K] extends FnConfig ? ReturnType<C[K]['fn']> : C[K] extends ValueConfig ? C[K]['value'] : never;

export type ValueAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K] extends ValueConfig ? K : never;
}[keyof C]>>;

export type FnAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K] extends FnConfig ? K : never;
}[keyof C]>>;

export type HiddenAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K]['hidden'] extends true ? K : never;
}[keyof C]>>;

export type VisibleAttrs<C extends Configs> = Attrs<Pick<C, {
  [K in keyof C]: C[K]['hidden'] extends true ? never : K;
}[keyof C]>>;

export type ReadOnlyAttrs<C extends Configs> = Pick<ValueAttrs<C>, {
  [K in keyof ValueAttrs<C>]: C[K] extends ValueConfig ? C[K]['readOnly'] extends true ? K : never : never;
}[keyof ValueAttrs<C>]>;

export type WritableAttrs<C extends Configs> = Omit<ValueAttrs<C>, keyof ReadOnlyAttrs<C>>;

export type InitialAttrs<C extends Configs> = Partial<ValueAttrs<C>>;

const isFnConfig = <V extends Value>(config: ValueConfig<V> | FnConfig<V>): config is FnConfig<V> => 'fn' in config;

const isValueConfig = <V extends Value>(config: ValueConfig<V> | FnConfig<V>): config is ValueConfig<V> => 'value' in config;

export class Entity<C extends Configs = Configs> {

  // See https://github.com/Microsoft/TypeScript/issues/3841
  ['constructor']!: EntityConstructor<C>;

  public static readonly configs = {};

  protected readOnlyValues: ReadOnlyAttrs<C>;
  protected writableValues: WritableAttrs<C>;

  // TODO: This should really be typed as keyof Writable<C> but because C defaults to Configs and
  // keyof WritableAttrs<Configs> resolves to never, instances of Entity<C> - where C is any
  // non-empty type - can never be compared to Entity<Configs>.
  protected modifiedSet = new Set<keyof C>();

  /**
   * Creates a new [[`Entity`]] instance. The attribute `configs` define the attributes available on
   * the [[`Entity`]] instance along with a default `value` for all required attributes. Default
   * values are not sanitized, normalized nor validated. Values provided via `attrs` are normalized
   * and validated, and may also include values for `readOnly` attributes.
   *
   * @param attrs
   */
  public constructor(attrs: InitialAttrs<C> = {}) {
    const readOnlyValues: Partial<ReadOnlyAttrs<C>> = {};
    const writableValues: Partial<WritableAttrs<C>> = {};

    (Object.entries(this.constructor.configs) as Entries<C>).forEach(([ name, config ]) => {
      if (isValueConfig(config)) {
        const value = cloneDeep((config as ValueConfig).value);
        if (config.readOnly) {
          readOnlyValues[name as keyof ReadOnlyAttrs<C>] = value;
        } else {
          writableValues[name as keyof WritableAttrs<C>] = value;
        }
      }
    });

    this.readOnlyValues = readOnlyValues as ReadOnlyAttrs<C>;
    this.writableValues = writableValues as WritableAttrs<C>;

    Object.seal(this.readOnlyValues);
    Object.seal(this.writableValues);

    this
      .fill(attrs)
      .clearModified();

    Object.freeze(this.readOnlyValues);
  }

  public config(name: keyof C): ValueConfig | FnConfig {
    if (!(name in this.constructor.configs)) {
      throw new UnconfiguredAttrError(this, name, `Attribute ${name} does not exist.`);
    }
    return this.constructor.configs[name];
  }

  /**
   * Sanitizes an arbitrary `value` using the configured `sanitizer` function for the specified
   * attribute `name`. The function will be called with the entity instance bound to `this`.
   *
   * @param name
   * @param value
   */
  public sanitize<K extends keyof ValueAttrs<C>, V extends ValueAttrs<C>[K]>(name: K, value: unknown): ReturnType<SanitizerFn<V>> {
    const config = this.config(name);
    if (!isValueConfig(config)) {
      throw new SanitizationError(this, name, value, `Attribute ${name} cannot be sanitized.`);
    }
    try {
      return config.sanitizer.call(this, value);
    } catch (err) {
      throw err instanceof SanitizationError
        ? err
        : new SanitizationError(this, name, value, err.message, err);
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
    const config = this.config(name);
    if (!isValueConfig(config)) {
      throw new NormalizationError(this, name, value, `Attribute ${name} cannot be normalized.`);
    }
    try {
      return (undefined !== value && null !== value && undefined !== config.normalizer)
        ? config.normalizer.call(this, value)
        : value;
    } catch (err) {
      throw err instanceof NormalizationError
        ? err
        : new NormalizationError(this, name, value, err.message, err);
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
    const config = this.config(name);
    if (!isValueConfig(config)) {
      throw new ValidationError(this, name, value, `Attribute ${name} cannot be validated.`);
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
      throw new ValidationError(this, name, value, `Attribute ${name} received an invalid value.`);
    } catch (err) {
      if (throws) {
        throw err instanceof ValidationError
          ? err
          : new ValidationError(this, name, value, err.message, err);
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
    const config = this.config(name);
    if (isFnConfig(config)) {
      return config.fn.call(this);
    }
    return ({
      ...this.readOnlyValues,
      ...this.writableValues,
    } as Attrs<C>)[name];
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
    return this.many(Object.keys(this.constructor.configs)) as Attrs<C>;
  }

  /**
   * Returns the attributes configured as `hidden`.
   */
  public hidden(): HiddenAttrs<C> {
    return this.many(
      Object.entries(this.constructor.configs)
        .filter(([ , config ]) => config.hidden)
        .map(([ name ]) => name)
    ) as HiddenAttrs<C>;
  }

  /**
   * Returns the attributes not configured as `hidden`.
   */
  public visible(): VisibleAttrs<C> {
    return this.many(
      Object.entries(this.constructor.configs)
        .filter(([ , config ]) => !config.hidden)
        .map(([ name ]) => name)
    ) as VisibleAttrs<C>;
  }

  /**
   * Returns value attributes that are configured as `readOnly`.
   */
  public readOnly(): ReadOnlyAttrs<C> {
    return this.readOnlyValues as ReadOnlyAttrs<C>;
  }

  /**
   * Returns value attributes that are not configured as `readOnly`.
   */
  public writable(): WritableAttrs<C> {
    return this.writableValues as WritableAttrs<C>;
  }

  /**
   * Returns the attributes that have been modified since instantiation.
   *
   * @param name
   */
  public modified(): Partial<WritableAttrs<C>> {
    return this.many(Array.from(this.modifiedSet.values()));
  }

  /**
   * Marks all attributes as unmodified.
   *
   * @param name
   */
  public clearModified(): this {
    this.modifiedSet.clear();
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
    value = this.normalize(name, this.sanitize(name, value));
    this.validate(name, value);
    if (this.one(name) !== value) {
      if (name in this.writableValues) {
        this.writableValues[name] = value;
      } else if (name in this.readOnlyValues && !Object.isFrozen(this.readOnlyValues)) {
        (this.readOnlyValues as unknown as WritableAttrs<C>)[name] = value;
      } else {
        throw new ReadOnlyError(this, name, value, `Attribute ${name} is read-only.`);
      }
      this.modifiedSet.add(name);
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
          config = this.config(name);
        } catch (err) {
          return;
        }
        if (isValueConfig(config)) {
          this.set(name, value);
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
   * Returns the attributes to be included when stringifying an instance to JSON form.
   *
   * @see [[`Entity.visible`]]
   */
  public toJSON(): VisibleAttrs<C> {
    return this.visible();
  }

  /**
   * Create a new entity instance from a JSON string.
   *
   * @param json
   */
  public static fromJSON<E extends Entity<Configs>>(json: string): E {
    // Cannot determine this type in static methods. Workaraound is to provide the type via generics.
    // See https://github.com/microsoft/TypeScript/issues/5863
    return new this(JSON.parse(json)) as E;
  }

  /**
   * Create a new entity instance from a source entity.
   *
   * @param entity
   */
  public static clone<E extends Entity<Configs>>(entity: E): E {
    const Constructor = entity.constructor;
    return new Constructor(entity.all()) as E;
  }

}
