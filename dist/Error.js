"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonwritableAttributeError = exports.InvalidAttributeError = exports.AttributeError = void 0;
class AttributeError extends Error {
    constructor(message, entity, attrName, attrValue) {
        super(message);
        this.entity = entity;
        this.attrName = attrName;
        this.attrValue = attrValue;
    }
}
exports.AttributeError = AttributeError;
class InvalidAttributeError extends AttributeError {
    constructor(entity, attrName, attrValue, message) {
        super(message || `Invalid value provided for ${entity.constructor.name}.${attrName}: ${attrValue}`, entity, attrName, attrValue);
    }
}
exports.InvalidAttributeError = InvalidAttributeError;
class NonwritableAttributeError extends AttributeError {
    constructor(entity, attrName, attrValue, message) {
        super(message || `Cannot set value for non-writable attribute ${entity.constructor.name}.${attrName}: ${attrValue}`, entity, attrName, attrValue);
    }
}
exports.NonwritableAttributeError = NonwritableAttributeError;
