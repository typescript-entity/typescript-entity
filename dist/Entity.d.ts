import { Config } from './Config';
import { Entityable } from './Entityable';
import { Attributes, Constructor, Sanitizers, Validators } from './types';
export declare abstract class Entity<C extends Config = Config> implements Entityable<C> {
    ['constructor']: Constructor<this, C>;
    readonly config: C;
    static config: Config;
    static sanitizers: Sanitizers<Entity>;
    static validators: Validators<Entity>;
    /**
     * @param config
     */
    constructor(config?: C);
    /**
     * Sanitizes all attributes on the entity.
     */
    sanitize(): this;
    /**
     * Returns a sanitized `value` for the given `key`.
     *
     * @param key
     * @param value
     */
    sanitizeValue<K extends keyof Attributes<this>>(key: K, value: any): Attributes<this>[K];
    /**
     * Validates all attributes on the entity. An error is thrown if anything fails validation.
     */
    validate(): this;
    /**
     * Validates a `value` for the given `key`. An error is thrown either by the validator function
     * itself, or a generic `TypeError` is thrown if the validator function returns falsey.
     *
     * @param key
     * @param value
     */
    validateValue<K extends keyof Attributes<this>>(key: K, value: any): true;
    /**
     * Sanitizes and validates all attributes on the entity.
     */
    clean(): this;
    /**
     * Merges an arbitrary set of attributes into the entity then cleans it up. Useful for hydrating a
     * entity from user provided data or JSON from an untrusted source.
     *
     * @param attrs
     * @param keys
     */
    merge(attrs: Partial<Attributes<this>>, keys?: (keyof Attributes<this>)[]): this;
    /**
     * Merges an arbitrary set of attributes into the entity without cleaning. Only use this if you
     * are certain the object contains clean data.
     *
     * @param attrs
     * @param keys
     */
    mergeRaw(attrs: Partial<Attributes<this>>, keys?: (keyof Attributes<this>)[]): this;
    /**
     * Include attributes defined by getters when stringifying the entity to JSON.
     */
    toJSON(): any;
}
