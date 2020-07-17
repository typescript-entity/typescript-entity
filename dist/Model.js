"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
var Model = /** @class */ (function () {
    /**
     * @param config
     */
    function Model(config) {
        if (config === void 0) { config = Model.config; }
        this.config = config;
        Object.defineProperty(this, 'config', {
            enumerable: false,
        });
    }
    /**
     * Sanitizes all attributes on the model.
     */
    Model.prototype.sanitize = function () {
        var _this = this;
        Object.keys(this.constructor.sanitizers).forEach(function (key) {
            _this[key] = _this.sanitizeValue(key, _this[key]);
        });
        return this;
    };
    /**
     * Returns a sanitized `value` for the given `key`.
     *
     * @param key
     * @param value
     */
    Model.prototype.sanitizeValue = function (key, value) {
        return this.constructor.sanitizers[key] ? this.constructor.sanitizers[key](this, key, value) : value;
    };
    /**
     * Validates all attributes on the model. An error is thrown if anything fails
     * validation.
     */
    Model.prototype.validate = function () {
        var _this = this;
        Object.keys(this.constructor.validators).forEach(function (key) {
            _this.validateValue(key, _this[key]);
        });
        return this;
    };
    /**
     * Validates a `value` for the given `key`. An error is thrown either by the
     * validator function itself, or a generic `TypeError` is thrown if the
     * validator function returns falsey.
     *
     * @param key
     * @param value
     */
    Model.prototype.validateValue = function (key, value) {
        if (undefined !== this.constructor.validators[key] && !this.constructor.validators[key](this, key, value)) {
            throw new TypeError("Invalid value provided for " + this.constructor.name + "." + key + ": " + value);
        }
        return true;
    };
    /**
     * Sanitizes and validates all attributes on the model.
     */
    Model.prototype.clean = function () {
        return this.sanitize().validate();
    };
    /**
     * Merges an arbitrary set of attributes into the model then cleans it up.
     * Useful for hydrating a model from user provided data or JSON from an
     * untrusted source.
     *
     * @param attrs
     * @param keys
     */
    Model.prototype.merge = function (attrs, keys) {
        return this.mergeRaw(attrs, keys).clean();
    };
    /**
     * Merges an arbitrary set of attributes into the model without cleaning. Only
     * use this if you are certain the object contains clean data.
     *
     * @param attrs
     * @param keys
     */
    Model.prototype.mergeRaw = function (attrs, keys) {
        var _this = this;
        (keys || Object.keys(this.constructor.sanitizers)
            .concat(Object.keys(this.constructor.validators))
            .filter(function (elem, pos, arr) { return arr.indexOf(elem) === pos; })).forEach(function (key) {
            if (undefined !== attrs[key]) {
                _this[key] = attrs[key];
            }
        });
        return this;
    };
    /**
     * Include attributes defined by getters when stringifying the model to JSON.
     */
    Model.prototype.toJSON = function () {
        var _this = this;
        var prototype = Object.getPrototypeOf(this);
        var json = Object.assign({}, this);
        Object.getOwnPropertyNames(prototype).forEach(function (key) {
            var descriptor = Object.getOwnPropertyDescriptor(prototype, key);
            if (descriptor && 'function' === typeof descriptor.get) {
                json[key] = _this[key];
            }
        });
        return json;
    };
    Model.config = {};
    Model.sanitizers = {};
    Model.validators = {};
    return Model;
}());
exports.Model = Model;
