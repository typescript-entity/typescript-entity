"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string = exports.integer = exports.float = exports.date = exports.boolean = void 0;
const validator_1 = require("validator");
exports.boolean = (value) => validator_1.default.toBoolean(exports.string(value));
exports.date = (value) => validator_1.default.toDate(value);
exports.float = (value) => validator_1.default.toFloat(exports.string(value));
exports.integer = (value) => validator_1.default.toInt(exports.string(value));
exports.string = (value) => null !== value && undefined !== value ? String(value) : '';
