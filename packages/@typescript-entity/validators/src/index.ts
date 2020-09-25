import { string as stringNormalizer } from '@typescript-entity/normalizers';
import validator from 'validator';

export const boolean = (value: boolean): boolean => validator.isBoolean(stringNormalizer(value));
export const email = (value: string, options: validator.IsEmailOptions = {}): boolean => validator.isEmail(stringNormalizer(value), options);
export const float = (value: number, options: validator.IsFloatOptions = {}): boolean => validator.isFloat(stringNormalizer(value), options);
export const integer = (value: number, options: validator.IsIntOptions = {}): boolean => validator.isInt(stringNormalizer(value), options);
export const string = (value: string, options: validator.IsLengthOptions = {}): boolean => validator.isLength(stringNormalizer(value), options);
export const uuid = (value: string, version: validator.UUIDVersion = 4): boolean => validator.isUUID(stringNormalizer(value), version);
