import { camelCase, capitalize as _capitalize, ceil as _ceil, floor as _floor, round as _round } from "lodash";
import validator from "validator";

export const camelize = (value: string): string => camelCase(value);

export const capitalize = (value: string): string => _capitalize(value);

export const ceil = (value: number, precision?: number): number => _ceil(value, precision);

export const floor = (value: number, precision?: number): number => _floor(value, precision);

export const lowercase = (value: string): string => value.toLowerCase();

export const round = (value: number, precision?: number): number => _round(value, precision);

export const trim = (value: string, chars?: string): string => validator.trim(value, chars);

export const uppercase = (value: string): string => value.toUpperCase();
