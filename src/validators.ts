import validator from 'validator';
import { string as stringNormalizer } from './normalizers';

export const boolean = (value: boolean) => validator.isBoolean(stringNormalizer(value));
export const email = (value: string, options: validator.IsEmailOptions = {}) => validator.isEmail(stringNormalizer(value), options);
export const float = (value: number, options: validator.IsFloatOptions = {}) => validator.isFloat(stringNormalizer(value), options);
export const integer = (value: number, options: validator.IsIntOptions = {}) => validator.isInt(stringNormalizer(value), options);
export const string = (value: string, options: validator.IsLengthOptions = {}) => validator.isLength(stringNormalizer(value), options);
export const uuid = (value: string, version: validator.UUIDVersion = 4) => validator.isUUID(stringNormalizer(value), version);
