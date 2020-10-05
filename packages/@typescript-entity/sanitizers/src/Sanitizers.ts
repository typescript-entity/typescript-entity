import validator from "validator";

export const toBoolean = (value: unknown): boolean => "boolean" === typeof value ? value : validator.toBoolean(toString(value));

export const toDate = (value: unknown): Date => {
  const sanitized = value instanceof Date ? value : validator.toDate(toString(value));
  if (!sanitized) {
    throw new Error(`Cannot sanitize value to Date: ${toString(value)}`);
  }
  return sanitized;
};

export const toFloat = (value: unknown): number => "number" === typeof value ? value : validator.toFloat(toString(value));

export const toInteger = (value: unknown): number => "number" === typeof value ? value : validator.toInt(toString(value));

export const toNumber = (value: unknown): number => {
  const sanitized = "number" === typeof value ? value : Number(value);
  if (Number.isNaN(sanitized)) {
    throw new Error(`Cannot sanitize value to number: ${toString(value)}`);
  }
  return sanitized;
};

export const toString = (value: unknown): string => "string" === typeof value ? value : undefined === value || null === value ? "" : String(value);
