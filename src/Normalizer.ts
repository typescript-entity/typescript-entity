import validator from 'validator';

export const boolean = (value: any) => 'boolean' === typeof value ? value : validator.toBoolean(string(value));
export const date = (value: any) => { if (value instanceof Date) { return value; } const date = validator.toDate(string(value)); if (!date) { throw new Error(`Cannot cast value to Date: ${value}`) }; return date; };
export const float = (value: any) => 'number' === typeof value ? value : validator.toFloat(string(value));
export const integer = (value: any) => 'number' === typeof value ? value : validator.toInt(string(value));
export const string = (value: any) => 'string' === typeof value ? value : null !== value && undefined !== value ? String(value) : '';
