import { Entity, SanitizationError } from '@typescript-entity/core';
import type { AttrName } from '@typescript-entity/core';
import validator from 'validator';
import { toString } from './toString';

export const toFloat = function(this: Entity, value: unknown, name: AttrName): number {
  const sanitized = 'number' === typeof value ? value : validator.toFloat(toString(value));
  if (Number.isNaN(sanitized)) {
    throw new SanitizationError(this, name, value, `Attribute ${name} received an value that could not be sanitized to a float: ${String(value)}`);
  }
  return sanitized;
};
