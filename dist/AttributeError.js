"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AttributeError extends Error {
    constructor(message, entity, attrName, attrValue) {
        super(message);
        this.entity = entity;
        this.attrName = attrName;
        this.attrValue = attrValue;
    }
}
exports.default = AttributeError;
