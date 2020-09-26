import validator from 'validator';

export const boolean = (value: unknown): boolean => 'boolean' === typeof value ? value : validator.toBoolean(string(value));
export const date = (value: unknown): Date => { if (value instanceof Date) { return value; } const date = validator.toDate(string(value)); if (!date) { throw new Error(`Cannot sanitize value to Date: ${value}`); } return date; };
export const float = (value: unknown): number => 'number' === typeof value ? value : validator.toFloat(string(value));
export const integer = (value: unknown): number => 'number' === typeof value ? value : validator.toInt(string(value));
export const string = (value: unknown): string => 'string' === typeof value ? value : null !== value && undefined !== value ? String(value) : '';
