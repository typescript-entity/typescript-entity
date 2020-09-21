import validator from 'validator';

export const boolean = (value: any) => validator.toBoolean(string(value));
export const date = (value: any) => validator.toDate(value);
export const float = (value: any) => validator.toFloat(string(value));
export const integer = (value: any) => validator.toInt(string(value));
export const string = (value: any) => null !== value && undefined !== value ? String(value) : '';
