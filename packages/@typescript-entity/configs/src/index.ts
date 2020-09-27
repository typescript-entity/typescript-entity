import { ValueConfig, WithNormalizer, WithValidator } from '@typescript-entity/core';
import { lowercase } from '@typescript-entity/normalizers';
import { toBoolean, toDate, toFloat, toInteger, toNumber, toString } from '@typescript-entity/sanitizers';
import { isAfter, isBefore, isEmail, isFloat, isInteger, isURL, isUUID } from '@typescript-entity/validators';

export type BooleanConfig = ValueConfig<boolean>;
export const BooleanConfig: BooleanConfig = {
  value: false,
  sanitizer: toBoolean,
};

export type DateConfig = ValueConfig<Date>;
export const DateConfig: DateConfig = {
  value: new Date(),
  sanitizer: toDate,
};

export type NumberConfig = ValueConfig<number>;
export const NumberConfig: NumberConfig = {
  value: 0,
  sanitizer: toNumber,
};

export type IntegerConfig = NumberConfig;
export const IntegerConfig: IntegerConfig = {
  ...NumberConfig,
  sanitizer: toInteger,
  validator: isInteger,
};

export type FloatConfig = NumberConfig;
export const FloatConfig: FloatConfig = {
  ...NumberConfig,
  sanitizer: toFloat,
  validator: isFloat,
};

export type StringConfig = ValueConfig<string>;
export const StringConfig: StringConfig = {
  value: '',
  sanitizer: toString,
};

export type DateInPastConfig = WithValidator<DateConfig>;
export const DateInPastConfig: DateInPastConfig = {
  ...DateConfig,
  validator: isBefore,
};

export type DateInFutureConfig = WithValidator<DateConfig>;
export const DateInFutureConfig: DateInFutureConfig = {
  ...DateConfig,
  validator: isAfter,
};

export type EmailConfig = WithValidator<ValueConfig<string>>;
export const EmailConfig: EmailConfig = {
  value: '',
  sanitizer: toString,
  validator: isEmail,
};

export type URLConfig = WithValidator<ValueConfig<string>>;
export const URLConfig: URLConfig = {
  value: '',
  sanitizer: toString,
  validator: isURL,
};

export type UUID4Config = WithValidator<WithNormalizer<ValueConfig<string>>>;
export const UUID4Config: UUID4Config = {
  value: '',
  sanitizer: toString,
  normalizer: lowercase,
  validator: isUUID,
};
