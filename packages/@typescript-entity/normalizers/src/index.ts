import { camelCase as baseCamelcase, capitalize as baseCapitalize, ceil as baseCeil, floor as baseFloor, round as baseRound } from 'lodash';
import validator from 'validator';

export const camelcase = (value: string): string => baseCamelcase(value);

export const capitalize = (value: string): string => baseCapitalize(value);

export const ceil = (value: number, precision?: number): number => baseCeil(value, precision);

export const floor = (value: number, precision?: number): number => baseFloor(value, precision);

export const lowercase = (value: string): string => value.toLowerCase();

export const round = (value: number, precision?: number): number => baseRound(value, precision);

export const trim = (value: string, chars?: string): string => validator.trim(value, chars);

export const uppercase = (value: string): string => value.toUpperCase();
