"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AttributeError_1 = require("./AttributeError");
class InvalidAttributeError extends AttributeError_1.default {
    constructor(entity, attrName, attrValue, message) {
        super(message || `Invalid value provided for ${entity.constructor.name}.${attrName}: ${attrValue}`, entity, attrName, attrValue);
    }
}
exports.default = InvalidAttributeError;
