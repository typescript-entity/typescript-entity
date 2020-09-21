"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AttributeError_1 = require("./AttributeError");
class NonwritableAttributeError extends AttributeError_1.default {
    constructor(entity, attrName, attrValue, message) {
        super(message || `Cannot set value for non-writable attribute ${entity.constructor.name}.${attrName}: ${attrValue}`, entity, attrName, attrValue);
    }
}
exports.default = NonwritableAttributeError;
