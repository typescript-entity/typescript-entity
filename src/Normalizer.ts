import * as lodash from 'lodash';
import validator from 'validator';

export const boolean = (value: any) => 'boolean' === typeof value ? value : validator.toBoolean(string(value));
export const camelcase = (value: any) => lodash.camelCase(value);
export const capitalize = (value: any) => lodash.capitalize(value);
export const ceil = (value: any, precision?: number) => lodash.ceil(float(value), precision);
export const date = (value: any) => { if (value instanceof Date) { return value; } const date = validator.toDate(string(value)); if (!date) { throw new Error(`Cannot normalize value to Date: ${value}`) }; return date; };
export const float = (value: any) => 'number' === typeof value ? value : validator.toFloat(string(value));
export const floor = (value: any, precision?: number) => lodash.floor(float(value), precision);
export const integer = (value: any) => 'number' === typeof value ? value : validator.toInt(string(value));
export const lowercase = (value: any) => string(value).toLowerCase();
export const round = (value: any, precision?: number) => lodash.round(value, precision);
export const string = (value: any) => 'string' === typeof value ? value : null !== value && undefined !== value ? String(value) : '';
export const trim = (value: any, chars?: string) => validator.trim(string(value), chars);
export const uppercase = (value: any) => string(value).toUpperCase();
