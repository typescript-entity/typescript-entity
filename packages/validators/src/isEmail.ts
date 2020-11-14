import type { AttrName } from '@typescript-entity/core';
import validator from 'validator';

export type IsEmailOptions = validator.IsEmailOptions;

export const isEmail = (value: string, name: AttrName, options: IsEmailOptions = {}): boolean => validator.isEmail(value, options);
