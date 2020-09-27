import { string as stringSanitizer } from '@typescript-entity/sanitizers';
import validator from 'validator';

export const boolean = (value: boolean): boolean => validator.isBoolean(stringSanitizer(value));

export const email = (value: string, options: validator.IsEmailOptions = {}): boolean => validator.isEmail(value, options);

export const float = (value: number, options: validator.IsFloatOptions = {}): boolean => validator.isFloat(stringSanitizer(value), options);

export const integer = (value: number, options: validator.IsIntOptions = {}): boolean => validator.isInt(stringSanitizer(value), options);

export const string = (value: string, options: validator.IsLengthOptions = {}): boolean => validator.isLength(value, options);

export const url = (value: string, options?: validator.IsURLOptions): boolean => validator.isURL(value, options);

export const uuid = (value: string, version: validator.UUIDVersion = 4): boolean => validator.isUUID(value, version);
