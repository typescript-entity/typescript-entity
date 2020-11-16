import { cloneDeep } from 'lodash';
import { EntityError } from './error/EntityError';
import { NormalizationError } from './error/NormalizationError';
import { ReadOnlyError } from './error/ReadOnlyError';
import { SanitizationError } from './error/SanitizationError';
import { UnconfiguredAttrError } from './error/UnconfiguredAttrError';
import { ValidationError } from './error/ValidationError';
import { isCallableAttrConfig, isWritableAttrConfig } from './TypeGuard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AttrValue = any;

export type AttrName = string

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AttrConfig = WritableAttrConfig<any> | CallableAttrConfig<any>;

export type AttrConfigSet = Record<AttrName, AttrConfig>;

export type AttrSet = Record<AttrName, AttrValue>;

export interface BaseAttrConfig {
  hidden?: boolean;
}

export interface WritableAttrConfig<V extends AttrValue> extends BaseAttrConfig {
  normalizer?: NormalizerFn<V>;
  immutable?: boolean;
  sanitizer: SanitizerFn<V>;
  validator?: ValidatorFn<V>;
  value: V;
  fn?: never;
}

export interface CallableAttrConfig<V extends AttrValue> extends BaseAttrConfig {
  fn: Fn<V>;
  value?: never;
}

export type Fn<V> = () => V;
export type SanitizerFn<V> = (value: unknown, name: AttrName) => V;
export type NormalizerFn<V> = (value: NonNullable<V>, name: AttrName) => V;
export type ValidatorFn<V> = (value: NonNullable<V>, name: AttrName) => boolean;

// Type interprets `keyof` as various types; attribute names should be strings only.
// Avoid using `keyof ResolveXAttrSet<...>` and use `ResolveXAttrName<...>` instead.
type AsAttrName<T> = T extends AttrName ? T : never;

export type ResolveAttrName<ACS extends AttrConfigSet> = AsAttrName<keyof ACS>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResolveAttrSet<ACS extends AttrConfigSet> = { [K in keyof ACS]: ACS[K] extends CallableAttrConfig<any> ? ReturnType<ACS[K]['fn']> : ACS[K] extends WritableAttrConfig<any> ? ACS[K]['value'] : never };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResolveCallableAttrName<ACS extends AttrConfigSet> = AsAttrName<{ [K in keyof ACS]: ACS[K] extends CallableAttrConfig<any> ? K : never }[keyof ACS]>;
export type ResolveCallableAttrConfigSet<ACS extends AttrConfigSet> = Pick<ACS, ResolveCallableAttrName<ACS>>;
export type ResolveCallableAttrSet<ACS extends AttrConfigSet> = ResolveAttrSet<ResolveCallableAttrConfigSet<ACS>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResolveWritableAttrName<ACS extends AttrConfigSet> = AsAttrName<{ [K in keyof ACS]: ACS[K] extends WritableAttrConfig<any> ? K : never }[keyof ACS]>;
export type ResolveWritableAttrConfigSet<ACS extends AttrConfigSet> = Pick<ACS, ResolveWritableAttrName<ACS>>;
export type ResolveWritableAttrSet<ACS extends AttrConfigSet> = ResolveAttrSet<ResolveWritableAttrConfigSet<ACS>>;

export type ResolveHiddenAttrName<ACS extends AttrConfigSet> = AsAttrName<{ [K in keyof ACS]: ACS[K]['hidden'] extends true ? K : never }[keyof ACS]>;
export type ResolveHiddenAttrConfigSet<ACS extends AttrConfigSet> = Pick<ACS, ResolveHiddenAttrName<ACS>>;
export type ResolveHiddenAttrSet<ACS extends AttrConfigSet> = ResolveAttrSet<ResolveHiddenAttrConfigSet<ACS>>;

export type ResolveVisibleAttrName<ACS extends AttrConfigSet> = AsAttrName<Exclude<keyof ACS, ResolveHiddenAttrName<ACS>>>;
export type ResolveVisibleAttrConfigSet<ACS extends AttrConfigSet> = Pick<ACS, ResolveVisibleAttrName<ACS>>;
export type ResolveVisibleAttrSet<ACS extends AttrConfigSet> = ResolveAttrSet<ResolveVisibleAttrConfigSet<ACS>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResolveImmutableAttrName<ACS extends AttrConfigSet> = AsAttrName<{ [K in keyof ACS]: ACS[K] extends WritableAttrConfig<any> ? ACS[K]['immutable'] extends true ? K : never : never }[keyof ACS]>;
export type ResolveImmutableAttrConfigSet<ACS extends AttrConfigSet> = Pick<ACS, ResolveImmutableAttrName<ACS>>;
export type ResolveImmutableAttrSet<ACS extends AttrConfigSet> = ResolveAttrSet<ResolveImmutableAttrConfigSet<ACS>>;

export type ResolveMutableAttrName<ACS extends AttrConfigSet> = AsAttrName<Exclude<ResolveWritableAttrName<ACS>, ResolveImmutableAttrName<ACS>>>;
export type ResolveMutableAttrConfigSet<ACS extends AttrConfigSet> = Pick<ACS, ResolveMutableAttrName<ACS>>;
export type ResolveMutableAttrSet<ACS extends AttrConfigSet> = ResolveAttrSet<ResolveMutableAttrConfigSet<ACS>>;

export type EntityConstructor<ACS extends AttrConfigSet, E extends Entity<ACS> = Entity<ACS>> = {
  new(data?: Partial<ResolveWritableAttrSet<ACS>> | E | string): E;
};

export type EntityWithAccessorsConstructor<ACS extends AttrConfigSet, E extends Entity<ACS> = Entity<ACS>> = EntityConstructor<ACS, E & ResolveAttrSet<ACS>>;

const EmptyObject = {};
export class Entity<ACS extends AttrConfigSet = typeof EmptyObject> {

  #attrConfigSet: ACS;
  #immutable: ResolveImmutableAttrSet<ACS>;
  #mutable: ResolveMutableAttrSet<ACS>;
  #modified: Set<AttrName> = new Set<ResolveMutableAttrName<ACS>>();

  /**
   * Creates a new [[`Entity`]] instance. The `attrConfigSet` defines the attributes available on
   * the [[`Entity`]] instance. Values defined in `attrConfigSet` are trusted and therefore not
   * sanitized, normalized nor validated. Data provided via `data` must be compatible with the data
   * expected by [[`Entity.fill()`]] but, unlike [[`Entity.fill()`]], may also include values for
   * immutable attributes.
   *
   * @param attrConfigSet
   * @param data
   */
  constructor(attrConfigSet: ACS, data: Partial<ResolveWritableAttrSet<ACS>> | Entity<ACS> | string = {}) {
    this.#attrConfigSet = attrConfigSet;
    Object.freeze(this.#attrConfigSet);

    const immutable: AttrSet = {};
    const mutable: AttrSet = {};

    Object.entries(this.#attrConfigSet).forEach(([ name, attrConfig ]) => {
      if (isWritableAttrConfig(attrConfig)) {
        const value = cloneDeep(attrConfig.value);
        if (attrConfig.immutable) {
          immutable[name] = value;
        } else {
          mutable[name] = value;
        }
      }
    });

    this.#immutable = immutable as ResolveImmutableAttrSet<ACS>;
    this.#mutable = mutable as ResolveMutableAttrSet<ACS>;

    Object.seal(this.#immutable);
    Object.seal(this.#mutable);

    this.fill(data).clearModified();

    Object.freeze(this.#immutable);
  }

  /**
   * Returns the value of the attribute provided in `name`.
   *
   * @param name
   */
  public one<K extends ResolveAttrName<ACS>>(name: K): ResolveAttrSet<ACS>[K] {
    const attrConfig = this.#attrConfigSet[name] as AttrConfig | undefined;
    if (!attrConfig) {
      throw new UnconfiguredAttrError(this, name, `Attribute ${name} cannot be read as it has not been configured.`)
    }
    let value: ResolveAttrSet<ACS>[K];
    if (isCallableAttrConfig(attrConfig)) {
      return attrConfig.fn.call(this);
    }
    if (attrConfig.immutable) {
      value = (this.#immutable as ResolveAttrSet<ACS>)[name];
    } else {
      value = (this.#mutable as ResolveAttrSet<ACS>)[name];
    }
    return cloneDeep(value);
  }

  /**
   * Returns an attribute set of the attributes provided in `names`.
   *
   * @param names
   */
  public many(names: ResolveAttrName<ACS>[]): Partial<ResolveAttrSet<ACS>> {
    return names.reduce((attrs, name) => ({
      ...attrs,
      [name]: this.one(name),
    }), {});
  }

  /**
   * Returns an attribute set of all attributes.
   */
  public all(): ResolveAttrSet<ACS> {
    return this.many(Object.keys(this.#attrConfigSet) as ResolveAttrName<ACS>[]) as ResolveAttrSet<ACS>;
  }

  /**
   * Returns an attribute set of all callable (non-writable) attributes.
   */
  public callable(): ResolveCallableAttrSet<ACS> {
    return this.many(
      Object.entries(this.#attrConfigSet)
        .filter(([ , attrConfig ]) => isCallableAttrConfig(attrConfig)).map(([ name ]) => name) as ResolveAttrName<ACS>[]
    ) as ResolveCallableAttrSet<ACS>;
  }

  /**
   * Returns an attribute set an all writable (non-callable) attributes.
   */
  public writable(): ResolveWritableAttrSet<ACS> {
    return this.many(
      Object.entries(this.#attrConfigSet)
      .filter(([ , attrConfig ]) => isWritableAttrConfig(attrConfig)).map(([ name ]) => name) as ResolveWritableAttrName<ACS>[]
    ) as ResolveWritableAttrSet<ACS>;
  }

  /**
   * Returns an attribute set of all attributes that have been configured as `immutable`.
   */
  public immutable(): ResolveImmutableAttrSet<ACS> {
    return cloneDeep(this.#immutable);
  }

  /**
   * Returns an attribute set of all attributes that have not been configured as `immutable`.
   */
  public mutable(): ResolveMutableAttrSet<ACS> {
    return cloneDeep(this.#mutable);
  }

  /**
   * Returns an attribute set of all attributes that have been configured as `hidden`.
   */
  public hidden(): ResolveHiddenAttrSet<ACS> {
    return this.many(
      Object.entries(this.#attrConfigSet)
        .filter(([ , attrConfig ]) => attrConfig.hidden).map(([ name ]) => name) as ResolveHiddenAttrName<ACS>[]
    ) as ResolveHiddenAttrSet<ACS>;
  }

  /**
   * Returns an attribute set of all attributes that have not been configured as `hidden`.
   */
  public visible(): ResolveVisibleAttrSet<ACS> {
    return this.many(
      Object.entries(this.#attrConfigSet)
        .filter(([ , attrConfig ]) => !attrConfig.hidden).map(([ name ]) => name) as ResolveVisibleAttrName<ACS>[]
    ) as ResolveVisibleAttrSet<ACS>;
  }

  /**
   * Returns an attribute set of all attributes that have been modified since instantiation or the
   * last call to [[`Entity.clearModified()`]].
   */
  public modified(): Partial<ResolveMutableAttrSet<ACS>> {
    return this.many(Array.from(this.#modified) as ResolveMutableAttrName<ACS>[]) as Partial<ResolveMutableAttrSet<ACS>>;
  }

  /**
   * Sets the `value` for the attribute `name`. Values can only be set for mutable, writable
   * attributes. The value will be sanitized, normalized and validated.
   *
   * @param name
   * @param value
   */
  public set<K extends ResolveMutableAttrName<ACS>>(name: K, value: ResolveMutableAttrSet<ACS>[K]): this {
    if (undefined === value) {
      return this;
    }

    const attrConfig = this.#attrConfigSet[name] as AttrConfig | undefined;
    if (!attrConfig) {
      throw new UnconfiguredAttrError(this, name, `Attribute ${name} cannot be set as it has not been configured.`)
    }
    if (!isWritableAttrConfig(attrConfig) || (attrConfig.immutable && Object.isFrozen(this.#immutable))) {
      throw new ReadOnlyError(this, name, value, `Attribute ${name} cannot be set as it is read-only.`);
    }

    value = cloneDeep(value);
    value = this.sanitize(name, value);
    value = this.normalize(name, value);
    this.validate(name, value);

    if (this.one(name) === value) {
      return this;
    }

    if (attrConfig.immutable) {
      (this.#immutable as ResolveWritableAttrSet<ACS>)[name] = value;
    } else {
      (this.#mutable as ResolveWritableAttrSet<ACS>)[name] = value;
      this.#modified.add(name);
    }

    return this;
  }

  /**
   * Sets multiple attribute values using the provided `data`. The incoming data is parsed into an
   * attribute set using [[`Entity.parseData()`]], before being sanitized, normalized and validated.
   *
   * @param data
   */
  public fill(data: Partial<ResolveMutableAttrSet<ACS>> | Entity<ACS> | string): this {
    Object.entries(this.parseData(data)).forEach(([ name, value ]) => {
      this.set(name as ResolveMutableAttrName<ACS>, value);
    });
    return this;
  }

  /**
   * Clears the modified attribute state. Typically used after calling an update/save endpoint to
   * signify that the instance is in sync with the upstream datasource.
   */
  public clearModified(): this {
    this.#modified.clear();
    return this;
  }

  /**
   * Sanitizes a `value` using the configured `sanitizer` function for the attribute `name`. The
   * function will have `this` scoped to the [[`Entity`]] instance.
   *
   * @param name
   * @param value
   */
  public sanitize<K extends ResolveWritableAttrName<ACS>>(name: K, value: unknown): ResolveWritableAttrSet<ACS>[K] {
    try {
      const attrConfig = this.#attrConfigSet[name] as AttrConfig | undefined;
      if (!attrConfig) {
        throw new UnconfiguredAttrError(this, name, `Attribute ${name} cannot be sanitized as it has not been configured.`)
      }
      if (!isWritableAttrConfig(attrConfig)) {
        throw new SanitizationError(this, name, value, `Attribute ${name} cannot be sanitized as it is not a writable attribute.`);
      }
      return attrConfig.sanitizer.call(this, value, name);
    } catch (err) {
      throw err instanceof SanitizationError ? err : new SanitizationError(this, name, value, err.message, err);
    }
  }

  /**
   * Normalizes a `value` using the configured `normalizer` function for the attribute `name`. If
   * the attribute does not have a normalizer function configured then that value is returned as-is.
   * The function will have `this` scoped to the [[`Entity`]] instance.
   *
   * @param name
   * @param value
   */
  public normalize<K extends ResolveWritableAttrName<ACS>, V extends ResolveWritableAttrSet<ACS>[K]>(name: K, value: V): V {
    try {
      const attrConfig = this.#attrConfigSet[name] as AttrConfig | undefined;
      if (!attrConfig) {
        throw new UnconfiguredAttrError(this, name, `Attribute ${name} cannot be normalized as it has not been configured.`)
      }
      if (!isWritableAttrConfig(attrConfig)) {
        throw new NormalizationError(this, name, value, `Attribute ${name} cannot be normalized as it is not a writable attribute.`);
      }
      return null !== value && attrConfig.normalizer ? attrConfig.normalizer.call(this, value, name) : value;
    } catch (err) {
      throw err instanceof NormalizationError ? err : new NormalizationError(this, name, value, err.message, err);
    }
  }

  /**
   * Validates a `value` using the configured `validator` function for the attribute `name`. If
   * the attribute does not have a validator function configured then that value is assumed valid.
   * The function will have `this` scoped to the [[`Entity`]] instance.
   *
   * @param name
   * @param value
   */
  public validate<K extends ResolveWritableAttrName<ACS>>(name: K, value: ResolveWritableAttrSet<ACS>[K]): boolean {
    try {
      const attrConfig = this.#attrConfigSet[name] as AttrConfig | undefined;
      if (!attrConfig) {
        throw new UnconfiguredAttrError(this, name, `Attribute ${name} cannot be validated as it has not been configured.`)
      }
      if (!isWritableAttrConfig(attrConfig)) {
        throw new ValidationError(this, name, value, `Attribute ${name} cannot be validated as it is not a writable attribute.`);
      }
      if (null !== value && attrConfig.validator && !attrConfig.validator.call(this, value, name)) {
        throw new ValidationError(this, name, value, `Attribute ${name} received an invalid value.`);
      }
      return true;
    } catch (err) {
      throw err instanceof ValidationError ? err : new ValidationError(this, name, value, err.message, err);
    }
  }

  /**
   * Attempts to parse incoming data which may be an attribute set, an [[`Entity`]] instance or a
   * JSON string.
   *
   * @param data
   */
  public parseData(data: unknown): AttrSet {
    if (data instanceof Entity) {
      return data.all();
    }
    if ('string' === typeof data) {
      try {
        data = JSON.parse(data);
      } catch (err) {
        throw new EntityError(this, err.message, err);
      }
    }
    if (null === data || undefined === data) {
      return {};
    }
    if ('object' !== typeof data) {
      throw new EntityError(this, 'Incoming attribute data is not an object.');
    }
    return data as AttrSet;
  }

  /**
   * Stringifies the instance to JSON.
   */
  public toString(): string
  {
    return JSON.stringify(this);
  }

  /**
   * Returns the data to expose when stringifying the instance to JSON.
   */
  public toJSON(): ResolveVisibleAttrSet<ACS> {
    return this.visible();
  }

}
