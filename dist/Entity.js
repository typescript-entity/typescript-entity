"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
class Entity {
    /**
     * @param config
     */
    constructor(config = Entity.config) {
        this.config = config;
        Object.defineProperty(this, 'config', {
            enumerable: false,
        });
    }
    /**
     * Sanitizes all attributes on the entity.
     */
    sanitize() {
        Object.keys(this.constructor.sanitizers).forEach((key) => {
            this[key] = this.sanitizeValue(key, this[key]);
        });
        return this;
    }
    /**
     * Returns a sanitized `value` for the given `key`.
     *
     * @param key
     * @param value
     */
    sanitizeValue(key, value) {
        return this.constructor.sanitizers[key] ? this.constructor.sanitizers[key](this, key, value) : value;
    }
    /**
     * Validates all attributes on the entity. An error is thrown if anything fails validation.
     */
    validate() {
        Object.keys(this.constructor.validators).forEach((key) => {
            this.validateValue(key, this[key]);
        });
        return this;
    }
    /**
     * Validates a `value` for the given `key`. An error is thrown either by the validator function
     * itself, or a generic `TypeError` is thrown if the validator function returns falsey.
     *
     * @param key
     * @param value
     */
    validateValue(key, value) {
        if (undefined !== this.constructor.validators[key] && !this.constructor.validators[key](this, key, value)) {
            throw new TypeError(`Invalid value provided for ${this.constructor.name}.${key}: ${value}`);
        }
        return true;
    }
    /**
     * Sanitizes and validates all attributes on the entity.
     */
    clean() {
        return this.sanitize().validate();
    }
    /**
     * Merges an arbitrary set of attributes into the entity then cleans it up. Useful for hydrating a
     * entity from user provided data or JSON from an untrusted source.
     *
     * @param attrs
     * @param keys
     */
    merge(attrs, keys) {
        return this.mergeRaw(attrs, keys).clean();
    }
    /**
     * Merges an arbitrary set of attributes into the entity without cleaning. Only use this if you
     * are certain the object contains clean data.
     *
     * @param attrs
     * @param keys
     */
    mergeRaw(attrs, keys) {
        (keys || Object.keys(this.constructor.sanitizers)
            .concat(Object.keys(this.constructor.validators))
            .filter((elem, pos, arr) => arr.indexOf(elem) === pos)).forEach((key) => {
            if (undefined !== attrs[key]) {
                this[key] = attrs[key];
            }
        });
        return this;
    }
    /**
     * Include attributes defined by getters when stringifying the entity to JSON.
     */
    toJSON() {
        const prototype = Object.getPrototypeOf(this);
        const json = Object.assign({}, this);
        Object.getOwnPropertyNames(prototype).forEach((key) => {
            const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
            if (descriptor && 'function' === typeof descriptor.get) {
                json[key] = this[key];
            }
        });
        return json;
    }
}
exports.Entity = Entity;
Entity.config = {};
Entity.sanitizers = {};
Entity.validators = {};
