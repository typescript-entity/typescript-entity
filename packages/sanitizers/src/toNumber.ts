import { Entity, SanitizationError } from '@typescript-entity/core';
import type { AttrName } from '@typescript-entity/core';

export const toNumber = function(this: Entity, value: unknown, name: AttrName): number {
  const sanitized = 'number' === typeof value ? value : Number(value);
  if (Number.isNaN(sanitized)) {
    throw new SanitizationError(this, name, value, `Attribute ${String(name)} received an value that could not be sanitized to a number: ${String(value)}`);
  }
  return sanitized;
};
