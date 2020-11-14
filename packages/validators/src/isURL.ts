import type { AttrName } from '@typescript-entity/core';
import validator from 'validator';

export type IsURLOptions = validator.IsURLOptions;

export const isURL = (value: string, name: AttrName, options: IsURLOptions = {}): boolean => validator.isURL(value, options);
