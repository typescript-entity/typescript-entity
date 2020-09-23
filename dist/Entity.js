"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const Error_1 = require("./Error");
class Entity {
    constructor(attrConfigs, initialAttrs = {}) {
        this.attrConfigs = Object.entries(attrConfigs).reduce((attrs, [name, attrConfig]) => (Object.assign(Object.assign({}, attrs), { [name]: Object.assign(Object.assign({}, attrConfig), { value: 'function' === typeof attrConfig.value ? attrConfig.value : lodash_1.cloneDeep(attrConfig.value) }) })), {});
        this.fill(initialAttrs, true);
    }
    normalize(name, value) {
        if ('function' !== typeof this.attrConfigs[name]['normalizer']) {
            return value;
        }
        return this.attrConfigs[name]['normalizer'].call(this, value);
    }
    validate(name, value) {
        if (undefined === value || 'function' !== typeof this.attrConfigs[name]['validator']) {
            return true;
        }
        return this.attrConfigs[name]['validator'].call(this, value);
    }
    all() {
        return Object.keys(this.attrConfigs).reduce((attrs, name) => (Object.assign(Object.assign({}, attrs), { [name]: this.get(name) })), {});
    }
    get(name) {
        return 'function' === typeof this.attrConfigs[name]['value']
            ? this.attrConfigs[name]['value'].call(this)
            : this.attrConfigs[name]['value'];
    }
    set(name, value, allowReadonly) {
        value = this.normalize(name, value);
        if (!this.validate(name, value)) {
            throw new Error_1.InvalidAttributeError(this, name, value);
        }
        return this.setDangerously(name, value, allowReadonly);
    }
    setDangerously(name, value, allowReadonly) {
        if ('function' === typeof this.attrConfigs[name]['value']) {
            throw new Error_1.FunctionAttributeError(this, name, value);
        }
        if (!allowReadonly && this.attrConfigs[name]['readonly']) {
            throw new Error_1.ReadonlyAttributeError(this, name, value);
        }
        this.attrConfigs[name]['value'] = value;
        return this;
    }
    fill(attrs, allowReadonly) {
        Object.entries(attrs).forEach(([name, value]) => {
            this.set(name, value, allowReadonly);
        });
        return this;
    }
    fillDangerously(attrs, allowReadonly) {
        Object.entries(attrs).forEach(([name, value]) => {
            this.setDangerously(name, value, allowReadonly);
        });
        return this;
    }
    toJSON() {
        return this.all();
    }
}
exports.default = Entity;
