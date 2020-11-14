import type { AttrName } from '@typescript-entity/core';
import validator from 'validator';
import { toString } from './toString';

export type ToBooleanOptions = { strict?: boolean };

export const toBoolean = (value: unknown, name: AttrName, options: ToBooleanOptions = {}): boolean => (
  'boolean' == typeof value
    ? value
    : validator.toBoolean(toString(value), options.strict)
);
