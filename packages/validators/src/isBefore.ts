import type { AttrName } from '@typescript-entity/core';
import { toString } from '@typescript-entity/sanitizers';
import validator from 'validator';

export interface IsBeforeOptions {
  now?: Date;
}

export const isBefore = (value: Date, name: AttrName, options: IsBeforeOptions = {}): boolean => (
  validator.isBefore(toString(value), options.now && toString(options.now))
);
