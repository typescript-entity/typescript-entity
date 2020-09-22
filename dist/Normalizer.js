"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string = exports.integer = exports.float = exports.date = exports.boolean = void 0;
const validator_1 = require("validator");
exports.boolean = (value) => 'boolean' === typeof value ? value : validator_1.default.toBoolean(exports.string(value));
exports.date = (value) => { if (value instanceof Date) {
    return value;
} const date = validator_1.default.toDate(exports.string(value)); if (!date) {
    throw new Error(`Cannot cast value to Date: ${value}`);
} ; return date; };
exports.float = (value) => 'number' === typeof value ? value : validator_1.default.toFloat(exports.string(value));
exports.integer = (value) => 'number' === typeof value ? value : validator_1.default.toInt(exports.string(value));
exports.string = (value) => 'string' === typeof value ? value : null !== value && undefined !== value ? String(value) : '';
