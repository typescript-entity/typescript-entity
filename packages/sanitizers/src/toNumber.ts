import { toString } from './toString';

export const toNumber = (value: unknown): number => {
  const sanitized = 'number' === typeof value ? value : Number(value);
  if (Number.isNaN(sanitized)) {
    throw new Error(`Value cannot be sanitized to Number: ${toString(value)}`);
  }
  return sanitized;
};
