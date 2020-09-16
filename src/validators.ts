import validator from 'validator';
import * as sanitizer from './sanitizers';

const boolean = (value: boolean) => 'boolean' === typeof value;
const email = (value: string) => string(value) && validator.isEmail(value);
const float = (value: number, options: validator.IsFloatOptions = {}) => 'number' === typeof value && validator.isFloat(sanitizer.string(value), options);
const integer = (value: number, options: validator.IsIntOptions = {}) => 'number' === typeof value && validator.isInt(sanitizer.string(value), options);
const string = (value: string, options: validator.IsLengthOptions = {}) => 'string' === typeof value && validator.isLength(value, options);
const uuid = (value: string, version: 3 | 4 | 5 | 'all' = 4) => string(value) && validator.isUUID(value, version);

export {
  boolean,
  email,
  float,
  integer,
  string,
  uuid,
};
