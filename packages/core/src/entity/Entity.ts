import { cloneDeep } from "lodash";
import { FnAttrError } from "../error/FnAttrError";
import { NotConfiguredError } from "../error/NotConfiguredError";
import { ReadOnlyError } from "../error/ReadOnlyError";
import { SanitizationError } from "../error/SanitizationError";
import { ValidationError } from "../error/ValidationError";

type Entries<T> = {
  [K in keyof T]: [ K, T[K] ];
}[keyof T][];

export interface EntityConstructor<T extends Entity> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new(...args: any[]): T;
  prototype: T;
}

export type Configs = Record<Name, StaticConfig | FnConfig>;

export interface StaticConfig<T extends StaticValue = StaticValue> {
  hidden?: boolean;
  normalizer?: NormalizerFn<T>;
  readOnly?: boolean;
  sanitizer: SanitizerFn<T>;
  validator?: ValidatorFn<T>;
  value: T;
}

export interface FnConfig<T extends StaticValue = StaticValue> {
  hidden?: boolean;
  value: FnValue<T>;
}

export type Name = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StaticValue = any;

export type FnValue<T extends StaticValue = StaticValue> = () => T;

export type SanitizerFn<T extends StaticValue = StaticValue> = (value: unknown) => T;

export type NormalizerFn<T extends StaticValue = StaticValue> = (value: NonNullable<T>) => T;

export type ValidatorFn<T extends StaticValue = StaticValue> = (value: NonNullable<T>) => boolean;

export type Attrs<T extends Configs> = {
  [K in keyof T]: Attr<T, K>;
};

export type Attr<T extends Configs, K extends keyof T> = T[K] extends FnConfig ? ReturnType<T[K]["value"]> : T[K]["value"];

export type StaticAttrs<T extends Configs> = Attrs<Pick<T, {
  [K in keyof T]: T[K] extends StaticConfig ? K : never;
}[keyof T]>>;

export type FnAttrs<T extends Configs> = Attrs<Pick<T, {
  [K in keyof T]: T[K] extends FnConfig ? K : never;
}[keyof T]>>;

export type HiddenAttrs<T extends Configs> = Attrs<Pick<T, {
  [K in keyof T]: T[K]["hidden"] extends true ? K : never;
}[keyof T]>>;

export type VisibleAttrs<T extends Configs> = Attrs<Pick<T, {
  [K in keyof T]: T[K]["hidden"] extends true ? never : K;
}[keyof T]>>;

export type ReadOnlyAttrs<T extends Configs> = Pick<StaticAttrs<T>, {
  [K in keyof StaticAttrs<T>]: T[K] extends StaticConfig ? T[K]["readOnly"] extends true ? K : never : never;
}[keyof StaticAttrs<T>]>;

export type WritableAttrs<T extends Configs> = Omit<StaticAttrs<T>, keyof ReadOnlyAttrs<T>>;

export type InitialAttrs<T extends Configs> = Partial<StaticAttrs<T>>;

const isFnConfigTypeGuard = <T extends StaticValue>(config: StaticConfig<T> | FnConfig<T>): config is FnConfig<T> => (
  "function" === typeof config.value
);

const isStaticConfigTypeGuard = <T extends StaticValue>(config: StaticConfig<T> | FnConfig<T>): config is StaticConfig<T> => (
  "function" !== typeof config.value
);

export abstract class Entity<C extends Configs = Configs> {

  protected _configs = new Map<keyof C, StaticConfig | FnConfig>();

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
  constructor(configs: C, attrs: InitialAttrs<C> = {}) {
    (Object.entries(configs) as Entries<InitialAttrs<C>>).forEach(([ name, config ]) => {
      this._configs.set(name, {
        ...config,
        value: "function" !== typeof config.value ? cloneDeep(config.value) : config.value,
      });
    });

    this
      .fill(attrs)
      .clearModified();

    this._configs.forEach((config) => {
      if (isStaticConfigTypeGuard(config) && config.readOnly) {
        Object.defineProperty(config, "value", { writable: false });
      }
    });
  }

  /**
   * Sanitizes an arbitrary `value` using the configured `sanitizer` function for the specified
   * attribute `name`. The function will be called with the entity instance bound to `this`.
   *
   * @param name
   * @param value
   */
  public sanitize<K extends keyof StaticAttrs<C>, V extends StaticAttrs<C>[K]>(name: K, value: unknown): ReturnType<NormalizerFn<V>> {
    const config = this._configs.get(name);
    if (undefined === config) {
      throw new NotConfiguredError(this, name);
    }
    if (isFnConfigTypeGuard(config)) {
      throw new FnAttrError(this, name);
    }
    try {
      return config.sanitizer.call(this, value);
    } catch (err) {
      throw err instanceof SanitizationError
        ? err
        : new SanitizationError(this, name, undefined, err);
    }
  }

  /**
   * Normalizes an non-nullish `value` using the configured `normalizer` function for the specified
   * attribute `name`. If a normalizer function has not been configured then the `value` is returned
   * as-is. The function will be called with the entity instance bound to `this`.
   *
   * @param name
   * @param value
   */
  public normalize<K extends keyof StaticAttrs<C>, V extends StaticAttrs<C>[K]>(name: K, value: V): ReturnType<NormalizerFn<V>> {
    const config = this._configs.get(name);
    if (undefined === config) {
      throw new NotConfiguredError(this, name);
    }
    if (isFnConfigTypeGuard(config)) {
      throw new FnAttrError(this, name);
    }
    return (undefined !== value && null !== value && undefined !== config.normalizer)
      ? config.normalizer.call(this, value)
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
  public validate<K extends keyof StaticAttrs<C>, V extends StaticAttrs<C>[K]>(name: K, value: V): ReturnType<ValidatorFn<V>> {
    const config = this._configs.get(name);
    if (undefined === config) {
      throw new NotConfiguredError(this, name);
    }
    if (isFnConfigTypeGuard(config)) {
      throw new FnAttrError(this, name);
    }
    return (undefined !== value && null !== value && undefined !== config.validator)
      ? config.validator.call(this, value)
      : true;
  }

  /**
   * Returns the value of the specified attribute `name`. If the attribute is configured as a value
   * function then this function is executed and the resulting value is returned. The function will
   * be called with the entity instance bound to `this`.
   *
   * @param name
   */
  public one<K extends keyof Attrs<C>, V extends Attrs<C>[K]>(name: K): V {
    const config = this._configs.get(name);
    if (undefined === config) {
      throw new NotConfiguredError(this, name);
    }
    return isFnConfigTypeGuard(config)
      ? config.value.call(this)
      : config.value;
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
   * normalized and validated. If validation fails an error is thrown and the attribute remains
   * unmodified.
   *
   * @param name
   * @param value
   */
  public set<K extends keyof WritableAttrs<C>, V extends WritableAttrs<C>[K]>(name: K, value: V): this {
    const config = this._configs.get(name);
    if (undefined === config) {
      throw new NotConfiguredError(this, name);
    }
    if (isFnConfigTypeGuard(config)) {
      throw new FnAttrError(this, name);
    }
    const descriptor = Object.getOwnPropertyDescriptor(config, "value");
    if (descriptor && !descriptor.writable) {
      throw new ReadOnlyError(this, name);
    }
    value = this.normalize(name, this.sanitize(name, value));
    if (!this.validate(name, value)) {
      throw new ValidationError(this, name, value);
    }
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
    (Object.entries(attrs) as Entries<WritableAttrs<C>>).forEach(([ name, value ]) => {
      const config = this._configs.get(name);
      if (
        // Prevent abuse of Partial which allows setting required attributes to undefined
        // https://github.com/microsoft/TypeScript/issues/13195
        // https://github.com/microsoft/TypeScript/issues/26438
        undefined !== value
        && undefined !== config
        && !isFnConfigTypeGuard(config)
      ) {
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

}
