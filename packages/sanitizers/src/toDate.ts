import validator from 'validator';
import { toString } from './toString';

export const toDate = (value: unknown): Date => {
  const sanitized = value instanceof Date ? value : validator.toDate(toString(value));
  if (null === sanitized) {
    throw new Error(`Value cannot be sanitized to Date: ${toString(value)}`);
  }
  return sanitized;
};
