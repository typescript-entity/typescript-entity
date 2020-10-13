import { toString } from "@typescript-entity/sanitizers";
import validator from "validator";
import type { IsAfterOptions, IsBeforeOptions, IsEmailOptions, IsFloatOptions, IsIntegerOptions, IsLengthOptions, IsNegativeFloatOptions, IsNegativeIntegerOptions, IsPositiveFloatOptions, IsPositiveIntegerOptions, IsURLOptions, IsUUIDOptions } from "./Types";

export const isAfter = (value: Date, options: IsAfterOptions = {}): boolean => validator.isAfter(toString(value), options.now && toString(options.now));

export const isBefore = (value: Date, options: IsBeforeOptions = {}): boolean => validator.isBefore(toString(value), options.now && toString(options.now));

export const isEmail = (value: string, options: IsEmailOptions = {}): boolean => validator.isEmail(value, options);

export const isFloat = (value: number, options: IsFloatOptions = {}): boolean => validator.isFloat(toString(value), options);

export const isInteger = (value: number, options: IsIntegerOptions = {}): boolean => validator.isInt(toString(value), options);

export const isLength = (value: string, options: IsLengthOptions = {}): boolean => validator.isLength(value, options);

export const isNegativeFloat = (value: number, options: IsNegativeFloatOptions = {}): boolean => isFloat(value, { ...options, lt: 0 });

export const isNegativeInteger = (value: number, options: IsNegativeIntegerOptions = {}): boolean => isInteger(value, { ...options, lt: 0 });

export const isPositiveFloat = (value: number, options: IsPositiveFloatOptions = {}): boolean => isFloat(value, { ...options, gt: 0 });

export const isPositiveInteger = (value: number, options: IsPositiveIntegerOptions = {}): boolean => isInteger(value, { ...options, gt: 0 });

export const isURL = (value: string, options: IsURLOptions = {}): boolean => validator.isURL(value, options);

export const isUUID = (value: string, options: IsUUIDOptions = {}): boolean => validator.isUUID(value, options.version);
