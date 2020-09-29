import { toString } from '@typescript-entity/sanitizers';
import validator from 'validator';

export const isAfter = (value: Date, date?: Date): boolean => validator.isAfter(toString(value), date && toString(date));

export const isBefore = (value: Date, date?: Date): boolean => validator.isBefore(toString(value), date && toString(date));

export const isEmail = (value: string, options: validator.IsEmailOptions = {}): boolean => validator.isEmail(value, options);

export const isFloat = (value: number, options: validator.IsFloatOptions = {}): boolean => validator.isFloat(toString(value), options);

export const isInteger = (value: number, options: validator.IsIntOptions = {}): boolean => validator.isInt(toString(value), options);

export const isLength = (value: string, options: validator.IsLengthOptions = {}): boolean => validator.isLength(value, options);

export const isURL = (value: string, options?: validator.IsURLOptions): boolean => validator.isURL(value, options);

export const isUUID = (value: string, version: validator.UUIDVersion = 4): boolean => validator.isUUID(value, version);
