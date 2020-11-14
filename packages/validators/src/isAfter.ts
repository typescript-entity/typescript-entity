import type { AttrName } from '@typescript-entity/core';
import { toString } from '@typescript-entity/sanitizers';
import validator from 'validator';

export interface IsAfterOptions {
  now?: Date;
}

export const isAfter = (value: Date, name: AttrName, options: IsAfterOptions = {}): boolean => (
  validator.isAfter(toString(value), options.now && toString(options.now))
);
