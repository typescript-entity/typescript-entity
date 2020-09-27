import { ValueConfig, WithNormalizer, WithValidator } from '@typescript-entity/core';
import { lowercase } from '@typescript-entity/normalizers';
import { toBoolean, toDate, toFloat, toInteger, toNumber, toString } from '@typescript-entity/sanitizers';
import { isAfter, isBefore, isEmail, isFloat, isInteger, isURL, isUUID } from '@typescript-entity/validators';

export type BooleanConfig = ValueConfig<boolean>;
export const booleanConfig: BooleanConfig = {
  value: false,
  sanitizer: toBoolean,
};

export type DateConfig = ValueConfig<Date>;
export const dateConfig: DateConfig = {
  value: new Date(),
  sanitizer: toDate,
};

export type NumberConfig = ValueConfig<number>;
export const numberConfig: NumberConfig = {
  value: 0,
  sanitizer: toNumber,
};

export type IntegerConfig = NumberConfig;
export const integerConfig: IntegerConfig = {
  ...numberConfig,
  sanitizer: toInteger,
  validator: isInteger,
};

export type FloatConfig = NumberConfig;
export const floatConfig: FloatConfig = {
  ...numberConfig,
  sanitizer: toFloat,
  validator: isFloat,
};

export type StringConfig = ValueConfig<string>;
export const stringConfig: StringConfig = {
  value: '',
  sanitizer: toString,
};

export type DateInPastConfig = WithValidator<DateConfig>;
export const dateInPastConfig: DateInPastConfig = {
  ...dateConfig,
  validator: isBefore,
};

export type DateInFutureConfig = WithValidator<DateConfig>;
export const dateInFutureConfig: DateInFutureConfig = {
  ...dateConfig,
  validator: isAfter,
};

export type EmailConfig = WithValidator<ValueConfig<string>>;
export const emailConfig: EmailConfig = {
  value: '',
  sanitizer: toString,
  validator: isEmail,
};

export type URLConfig = WithValidator<ValueConfig<string>>;
export const urlConfig: URLConfig = {
  value: '',
  sanitizer: toString,
  validator: isURL,
};

export type UUID4Config = WithValidator<WithNormalizer<ValueConfig<string>>>;
export const uuid4Config: UUID4Config = {
  value: '',
  sanitizer: toString,
  normalizer: lowercase,
  validator: isUUID,
};
