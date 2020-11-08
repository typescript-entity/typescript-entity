import validator from 'validator';
import { toString } from './toString';

export const toFloat = (value: unknown): number => {
  const sanitized = 'number' === typeof value ? value : validator.toFloat(toString(value));
  if (Number.isNaN(sanitized)) {
    throw new Error(`Value cannot be sanitized to float: ${toString(value)}`);
  }
  return sanitized;
};
