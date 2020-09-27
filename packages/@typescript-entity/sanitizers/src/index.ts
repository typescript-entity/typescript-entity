import validator from 'validator';

export const boolean = (value: unknown): boolean => 'boolean' === typeof value ? value : validator.toBoolean(string(value));

export const date = (value: unknown): Date => {
  const sanitized = value instanceof Date ? value : validator.toDate(string(value));
  if (!sanitized) {
    throw new Error(`Cannot sanitize value to Date: ${string(value)}`);
  }
  return sanitized;
};

export const float = (value: unknown): number => 'number' === typeof value ? value : validator.toFloat(string(value));

export const integer = (value: unknown): number => 'number' === typeof value ? value : validator.toInt(string(value));

export const string = (value: unknown): string => 'string' === typeof value ? value : undefined === value || null === value ? '' : String(value);
