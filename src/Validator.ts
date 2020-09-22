import validator from 'validator';
import * as Normalizer from './Normalizer';

export const boolean = (value: boolean) => validator.isBoolean(Normalizer.string(value));
export const email = (value: string, options: validator.IsEmailOptions = {}) => validator.isEmail(Normalizer.string(value), options);
export const float = (value: number, options: validator.IsFloatOptions = {}) => validator.isFloat(Normalizer.string(value), options);
export const integer = (value: number, options: validator.IsIntOptions = {}) => validator.isInt(Normalizer.string(value), options);
export const string = (value: string, options: validator.IsLengthOptions = {}) => validator.isLength(Normalizer.string(value), options);
export const uuid = (value: string, version: validator.UUIDVersion = 4) => validator.isUUID(Normalizer.string(value), version);
