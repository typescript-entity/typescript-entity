import validator from "validator";
import { toString } from "./toString";

export type ToBooleanOptions = { strict?: boolean };

export const toBoolean = (value: unknown, options: ToBooleanOptions = {}): boolean => (
  "boolean" == typeof value
    ? value
    : validator.toBoolean(toString(value), options.strict)
);
