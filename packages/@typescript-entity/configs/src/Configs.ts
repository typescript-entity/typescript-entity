import { Value, ValueFn } from '@typescript-entity/core';
import { lowercase } from '@typescript-entity/normalizers';
import { toBoolean, toDate, toFloat, toInteger, toNumber, toString } from '@typescript-entity/sanitizers';
import { isAfter, IsAfterOptions, isBefore, IsBeforeOptions, isEmail, IsEmailOptions, isFloat, IsFloatOptions, isInteger, IsIntegerOptions, isNegativeFloat, IsNegativeFloatOptions, isNegativeInteger, IsNegativeIntegerOptions, isPositiveFloat, IsPositiveFloatOptions, isPositiveInteger, IsPositiveIntegerOptions, isURL, IsURLOptions, isUUID, IsUUIDOptions } from '@typescript-entity/validators';
import { BooleanConfig, DateConfig, DateInFutureConfig, DateInPastConfig, EmailConfig, FloatConfig, FnConfig, IntegerConfig, NegativeFloatConfig, NegativeIntegerConfig, NumberConfig, PositiveFloatConfig, PositiveIntegerConfig, StringConfig, URLConfig, UUIDConfig } from './Types';

export const booleanConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): BooleanConfig<O, H, R> => ({
  hidden,
  readOnly,
  value: optional ? undefined : false,
  sanitizer: optional
    ? (value: unknown): boolean | undefined => toString(value) ? toBoolean(value) : undefined
    : toBoolean,
} as BooleanConfig<O, H, R>);

export const dateConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): DateConfig<O, H, R> => ({
  hidden,
  readOnly,
  value: optional ? undefined : new Date(0),
  sanitizer: optional
    ? (value: unknown): Date | undefined => toString(value) ? toDate(value) : undefined
    : toDate,
} as DateConfig<O, H, R>);

export const fnConfig = <
  V extends Value,
  O extends boolean = false,
  H extends boolean = false,
>(value: ValueFn<V>, optional?: O, hidden?: H): FnConfig<V, O, H> => ({
  hidden,
  value,
} as FnConfig<V, O, H>);

export const numberConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): NumberConfig<O, H, R> => ({
  hidden,
  readOnly,
  value: optional ? undefined : 0,
  sanitizer: optional
    ? (value: unknown): number | undefined => toString(value) ? toNumber(value) : undefined
    : toNumber,
} as NumberConfig<O, H, R>);

export const stringConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): StringConfig<O, H, R> => ({
  hidden,
  readOnly,
  value: optional ? undefined : '',
  sanitizer: optional
    ? (value: unknown): string | undefined => toString(value) || undefined
    : toString,
} as StringConfig<O, H, R>);

export const dateInFutureConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsAfterOptions = {}): DateInFutureConfig<O, H, R> => ({
  ...dateConfig(optional, hidden, readOnly),
  validator: (value: Date): boolean => isAfter(value, options),
});

export const dateInPastConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsBeforeOptions = {}): DateInPastConfig<O, H, R> => ({
  ...dateConfig(optional, hidden, readOnly),
  validator: (value: Date): boolean => isBefore(value, options),
});

export const emailConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsEmailOptions = {}): EmailConfig<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  validator: (value: string): boolean => isEmail(value, options),
});

export const floatConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsFloatOptions = {}): FloatConfig<O, H, R> => ({
  ...numberConfig(optional, hidden, readOnly),
  sanitizer: optional
    ? (value: unknown): number | undefined => toString(value) ? toFloat(value) : undefined
    : toFloat,
  validator: (value: number): boolean => isFloat(value, options),
} as FloatConfig<O, H, R>);

export const integerConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsIntegerOptions = {}): IntegerConfig<O, H, R> => ({
  ...numberConfig(optional, hidden, readOnly),
  sanitizer: optional
    ? (value: unknown): number | undefined => toString(value) ? toInteger(value) : undefined
    : toInteger,
    validator: (value: number): boolean => isInteger(value, options),
} as IntegerConfig<O, H, R>);

export const negativeFloatConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsNegativeFloatOptions = {}): NegativeFloatConfig<O, H, R> => ({
  ...floatConfig(optional, hidden, readOnly),
  validator: (value: number): boolean => isNegativeFloat(value, options),
});

export const negativeIntegerConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsNegativeIntegerOptions = {}): NegativeIntegerConfig<O, H, R> => ({
  ...integerConfig(optional, hidden, readOnly),
  validator: (value: number): boolean => isNegativeInteger(value, options),
});

export const positiveFloatConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsPositiveFloatOptions = {}): PositiveFloatConfig<O, H, R> => ({
  ...floatConfig(optional, hidden, readOnly),
  validator: (value: number): boolean => isPositiveFloat(value, options),
});

export const positiveIntegerConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsPositiveIntegerOptions = {}): PositiveIntegerConfig<O, H, R> => ({
  ...integerConfig(optional, hidden, readOnly),
  validator: (value: number): boolean => isPositiveInteger(value, options),
});

export const urlConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsURLOptions = {}): URLConfig<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  validator: (value: string) => isURL(value, options),
});

export const uuidConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsUUIDOptions = {}): UUIDConfig<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  normalizer: optional
    ? (value: string): string | undefined => lowercase(value) || undefined
    : lowercase,
    validator: (value: string) => isUUID(value, options),
} as UUIDConfig<O, H, R>);
