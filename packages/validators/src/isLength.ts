import type { AttrName } from '@typescript-entity/core';
import validator from 'validator';

export type IsLengthOptions = validator.IsLengthOptions;

export const isLength = (value: string, name: AttrName, options: IsLengthOptions = {}): boolean => validator.isLength(value, options);
