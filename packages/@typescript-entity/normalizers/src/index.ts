import { camelCase as _Camelcase, capitalize as _Capitalize, ceil as _Ceil, floor as _Floor, round as _Round } from 'lodash';
import validator from 'validator';

export const camelcase = (value: string): string => _Camelcase(value);

export const capitalize = (value: string): string => _Capitalize(value);

export const ceil = (value: number, precision?: number): number => _Ceil(value, precision);

export const floor = (value: number, precision?: number): number => _Floor(value, precision);

export const lowercase = (value: string): string => value.toLowerCase();

export const round = (value: number, precision?: number): number => _Round(value, precision);

export const trim = (value: string, chars?: string): string => validator.trim(value, chars);

export const uppercase = (value: string): string => value.toUpperCase();
