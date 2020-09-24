import validator from 'validator';
import * as Normalizer from './Normalizer';

export const boolean = (value: boolean): boolean => validator.isBoolean(Normalizer.string(value));
export const email = (value: string, options: validator.IsEmailOptions = {}): boolean => validator.isEmail(Normalizer.string(value), options);
export const float = (value: number, options: validator.IsFloatOptions = {}): boolean => validator.isFloat(Normalizer.string(value), options);
export const integer = (value: number, options: validator.IsIntOptions = {}): boolean => validator.isInt(Normalizer.string(value), options);
export const string = (value: string, options: validator.IsLengthOptions = {}): boolean => validator.isLength(Normalizer.string(value), options);
export const uuid = (value: string, version: validator.UUIDVersion = 4): boolean => validator.isUUID(Normalizer.string(value), version);
