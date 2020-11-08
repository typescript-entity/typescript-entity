import validator from 'validator';
import { toString } from './toString';

export const toInteger = (value: unknown): number => {
  const sanitized = 'number' === typeof value ? value : validator.toInt(toString(value));
  if (Number.isNaN(sanitized)) {
    throw new Error(`Value cannot be sanitized to integer: ${toString(value)}`);
  }
  return sanitized;
};
