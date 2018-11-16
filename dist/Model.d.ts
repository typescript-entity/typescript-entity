import { Config, Modelable } from './interfaces';
import { Attributes, Constructor, Sanitizers, Validators } from './types';
export default abstract class Model<C extends Config = Config> implements Modelable<C> {
    ['constructor']: Constructor<this, C>;
    readonly config: C;
    static config: Config;
    static sanitizers: Sanitizers<Model>;
    static validators: Validators<Model>;
    /**
     * @param config
     */
    constructor(config?: C);
    /**
     * Sanitizes all attributes on the model.
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
     * Validates all attributes on the model. An error is thrown if anything fails
     * validation.
     */
    validate(): this;
    /**
     * Validates a `value` for the given `key`. An error is thrown either by the
     * validator function itself, or a generic `TypeError` is thrown if the
     * validator function returns falsey.
     *
     * @param key
     * @param value
     */
    validateValue<K extends keyof Attributes<this>>(key: K, value: any): true;
    /**
     * Sanitizes and validates all attributes on the model.
     */
    clean(): this;
    /**
     * Merges an arbitrary set of attributes into the model then cleans it up.
     * Useful for hydrating a model from user provided data or JSON from an
     * untrusted source.
     *
     * @param attrs
     * @param keys
     */
    merge(attrs: Partial<Attributes<this>>, keys?: (keyof Attributes<this>)[]): this;
    /**
     * Merges an arbitrary set of attributes into the model without cleaning. Only
     * use this if you are certain the object contains clean data.
     *
     * @param attrs
     * @param keys
     */
    mergeRaw(attrs: Partial<Attributes<this>>, keys?: (keyof Attributes<this>)[]): this;
    /**
     * Include attributes defined by getters when stringifying the model to JSON.
     */
    toJSON(): any;
}
