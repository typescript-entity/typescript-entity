import { Entity, SanitizationError } from '@typescript-entity/core';
import type { AttrName } from '@typescript-entity/core';
import validator from 'validator';
import { toString } from './toString';

export const toDate = function(this: Entity, value: unknown, name: AttrName): Date {
  const sanitized = value instanceof Date ? value : validator.toDate(toString(value));
  if (null === sanitized) {
    throw new SanitizationError(this, name, value, `Attribute ${String(name)} received an value that could not be sanitized to a Date: ${String(value)}`);
  }
  return sanitized;
};
