import validator from 'validator';
import * as sanitizer from './sanitizers';
const boolean = (value) => 'boolean' === typeof value;
const email = (value) => string(value) && validator.isEmail(value);
const float = (value, options = {}) => 'number' === typeof value && validator.isFloat(sanitizer.string(value), options);
const integer = (value, options = {}) => 'number' === typeof value && validator.isInt(sanitizer.string(value), options);
const string = (value, options = {}) => 'string' === typeof value && validator.isLength(value, options);
const uuid = (value, version = 4) => string(value) && validator.isUUID(value, version);
export { boolean, email, float, integer, string, uuid, };
