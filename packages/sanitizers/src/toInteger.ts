import { Entity, SanitizationError } from '@typescript-entity/core';
import type { AttrName } from '@typescript-entity/core';
import validator from 'validator';
import { toString } from './toString';

export const toInteger = function(this: Entity, value: unknown, name: AttrName): number {
  const sanitized = 'number' === typeof value ? value : validator.toInt(toString(value));
  if (Number.isNaN(sanitized)) {
    throw new SanitizationError(this, name, value, `Attribute ${name} received an value that could not be sanitized to an integer: ${JSON.stringify(value)}`);
  }
  return sanitized;
};
