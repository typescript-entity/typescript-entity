import * as lodash from 'lodash';
import validator from 'validator';

export const boolean = (value: unknown): boolean => 'boolean' === typeof value ? value : validator.toBoolean(string(value));
export const camelcase = (value: unknown): string => lodash.camelCase(string(value));
export const capitalize = (value: unknown): string => lodash.capitalize(string(value));
export const ceil = (value: unknown, precision?: number): number => lodash.ceil(float(value), precision);
export const date = (value: unknown): Date => { if (value instanceof Date) { return value; } const date = validator.toDate(string(value)); if (!date) { throw new Error(`Cannot normalize value to Date: ${value}`); } return date; };
export const float = (value: unknown): number => 'number' === typeof value ? value : validator.toFloat(string(value));
export const floor = (value: unknown, precision?: number): number => lodash.floor(float(value), precision);
export const integer = (value: unknown): number => 'number' === typeof value ? value : validator.toInt(string(value));
export const lowercase = (value: unknown): string => string(value).toLowerCase();
export const round = (value: unknown, precision?: number): number => lodash.round(float(value), precision);
export const string = (value: unknown): string => 'string' === typeof value ? value : null !== value && undefined !== value ? String(value) : '';
export const trim = (value: unknown, chars?: string): string => validator.trim(string(value), chars);
export const uppercase = (value: unknown): string => string(value).toUpperCase();
