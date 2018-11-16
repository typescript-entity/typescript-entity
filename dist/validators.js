"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validator = require("validator");
var sanitizer = require("./sanitizers");
var boolean = function (value) { return 'boolean' === typeof value; };
exports.boolean = boolean;
var email = function (value) { return string(value) && validator.isEmail(value); };
exports.email = email;
var float = function (value, options) {
    if (options === void 0) { options = {}; }
    return 'number' === typeof value && validator.isFloat(sanitizer.string(value), options);
};
exports.float = float;
var integer = function (value, options) {
    if (options === void 0) { options = {}; }
    return 'number' === typeof value && validator.isInt(sanitizer.string(value), options);
};
exports.integer = integer;
var string = function (value, options) {
    if (options === void 0) { options = {}; }
    return 'string' === typeof value && validator.isLength(value, options);
};
exports.string = string;
var uuid = function (value, version) {
    if (version === void 0) { version = 4; }
    return string(value) && validator.isUUID(value, version);
};
exports.uuid = uuid;
