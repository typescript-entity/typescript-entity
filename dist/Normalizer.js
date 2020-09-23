"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uppercase = exports.trim = exports.string = exports.round = exports.lowercase = exports.integer = exports.floor = exports.float = exports.date = exports.ceil = exports.capitalize = exports.camelcase = exports.boolean = void 0;
const lodash = require("lodash");
const validator_1 = require("validator");
exports.boolean = (value) => 'boolean' === typeof value ? value : validator_1.default.toBoolean(exports.string(value));
exports.camelcase = (value) => lodash.camelCase(value);
exports.capitalize = (value) => lodash.capitalize(value);
exports.ceil = (value, precision) => lodash.ceil(exports.float(value), precision);
exports.date = (value) => { if (value instanceof Date) {
    return value;
} const date = validator_1.default.toDate(exports.string(value)); if (!date) {
    throw new Error(`Cannot normalize value to Date: ${value}`);
} ; return date; };
exports.float = (value) => 'number' === typeof value ? value : validator_1.default.toFloat(exports.string(value));
exports.floor = (value, precision) => lodash.floor(exports.float(value), precision);
exports.integer = (value) => 'number' === typeof value ? value : validator_1.default.toInt(exports.string(value));
exports.lowercase = (value) => exports.string(value).toLowerCase();
exports.round = (value, precision) => lodash.round(value, precision);
exports.string = (value) => 'string' === typeof value ? value : null !== value && undefined !== value ? String(value) : '';
exports.trim = (value, chars) => validator_1.default.trim(exports.string(value), chars);
exports.uppercase = (value) => exports.string(value).toUpperCase();
