"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const Error_1 = require("./Error");
class Entity {
    constructor(attributeConfigs, attrs = {}) {
        this.attributeConfigs = attributeConfigs;
        this.fill(lodash_1.cloneDeep(attrs), true, true, true);
    }
    attr(name) {
        const attrConfig = this.attributeConfigs[name];
        return 'function' === typeof attrConfig.value ? attrConfig.value(this, name) : attrConfig.value;
    }
    attrs() {
        return Object.keys(this.attributeConfigs).reduce((accumulator, name) => (Object.assign(Object.assign({}, accumulator), { [name]: this.attr(name) })), {});
    }
    fill(attrs, normalize = true, validate = true, allowReadonly = false) {
        if (normalize) {
            attrs = this.normalizeAttrs(attrs);
        }
        if (validate) {
            this.validateAttrs(attrs, true);
        }
        Object.entries(attrs)
            .filter(([name]) => !!this.attributeConfigs[name])
            .forEach(([name, value]) => {
            const attrConfig = this.attributeConfigs[name];
            if ((!allowReadonly && attrConfig.readonly) || 'function' === typeof attrConfig.value) {
                throw new Error_1.NonwritableAttributeError(this, name, value);
            }
            attrConfig.value = value;
        });
        return this;
    }
    normalizeAttr(name, value) {
        const attrConfig = this.attributeConfigs[name];
        return attrConfig && 'function' === typeof attrConfig.normalizer ? attrConfig.normalizer(this, name, value) : value;
    }
    normalizeAttrs(attrs) {
        return Object.entries(attrs)
            .filter(([name]) => !!this.attributeConfigs[name])
            .reduce((acc, [name, value]) => (Object.assign(Object.assign({}, acc), { [name]: this.normalizeAttr(name, value) })), {});
    }
    validateAttr(name, value, throwOnInvalid = false) {
        const attrConfig = this.attributeConfigs[name];
        if (!attrConfig || 'function' !== typeof attrConfig.validator || attrConfig.validator(this, name, value)) {
            return true;
        }
        if (throwOnInvalid) {
            throw new Error_1.InvalidAttributeError(this, name, value);
        }
        return false;
    }
    validateAttrs(attrs, throwOnInvalid = false) {
        return !!Object.entries(attrs)
            .filter(([name]) => !!this.attributeConfigs[name])
            .find(([name, value]) => !this.validateAttr(name, value, throwOnInvalid));
    }
    toJSON() {
        return this.attrs();
    }
}
exports.default = Entity;
