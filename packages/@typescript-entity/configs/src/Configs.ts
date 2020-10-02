import { BooleanConfigFactory, DateConfigFactory, FnConfigFactory, NumberConfigFactory, StringConfigFactory, ValueFn } from '@typescript-entity/core';
import { lowercase } from '@typescript-entity/normalizers';
import { toBoolean, toDate, toFloat, toInteger, toNumber, toString } from '@typescript-entity/sanitizers';
import { isAfter, IsAfterOptions, isBefore, IsBeforeOptions, isEmail, IsEmailOptions, isFloat, IsFloatOptions, isInteger, IsIntegerOptions, isNegativeFloat, IsNegativeFloatOptions, isNegativeInteger, IsNegativeIntegerOptions, isPositiveFloat, IsPositiveFloatOptions, isPositiveInteger, IsPositiveIntegerOptions, isURL, IsURLOptions, isUUID, IsUUIDOptions } from '@typescript-entity/validators';
import { DateInFutureConfigFactory, DateInPastConfigFactory, EmailConfigFactory, FloatConfigFactory, IntegerConfigFactory, NegativeFloatConfigFactory, NegativeIntegerConfigFactory, PositiveFloatConfigFactory, PositiveIntegerConfigFactory, URLConfigFactory, UUIDConfigFactory } from './Types';

export const booleanConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): BooleanConfigFactory<O, H, R> => ({
  hidden,
  readOnly,
  value: optional ? undefined : false,
  sanitizer: optional
    ? (value: unknown): boolean | undefined => toString(value) ? toBoolean(value) : undefined
    : toBoolean,
} as BooleanConfigFactory<O, H, R>);

export const dateConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): DateConfigFactory<O, H, R> => ({
  hidden,
  readOnly,
  value: optional ? undefined : new Date(0),
  sanitizer: optional
    ? (value: unknown): Date | undefined => toString(value) ? toDate(value) : undefined
    : toDate,
} as DateConfigFactory<O, H, R>);

export const fnConfig = <
  V extends ValueFn,
  O extends boolean = false,
  H extends boolean = false,
>(value: V, optional?: O, hidden?: H): FnConfigFactory<ReturnType<V>, O, H> => ({
  hidden,
  value,
} as unknown as FnConfigFactory<ReturnType<V>, O, H>);

export const numberConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): NumberConfigFactory<O, H, R> => ({
  hidden,
  readOnly,
  value: optional ? undefined : 0,
  sanitizer: optional
    ? (value: unknown): number | undefined => toString(value) ? toNumber(value) : undefined
    : toNumber,
} as NumberConfigFactory<O, H, R>);

export const stringConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): StringConfigFactory<O, H, R> => ({
  hidden,
  readOnly,
  value: optional ? undefined : '',
  sanitizer: optional
    ? (value: unknown): string | undefined => toString(value) || undefined
    : toString,
} as StringConfigFactory<O, H, R>);

export const dateInFutureConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsAfterOptions = {}): DateInFutureConfigFactory<O, H, R> => ({
  ...dateConfig(optional, hidden, readOnly),
  validator: (value: Date): boolean => isAfter(value, options),
});

export const dateInPastConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsBeforeOptions = {}): DateInPastConfigFactory<O, H, R> => ({
  ...dateConfig(optional, hidden, readOnly),
  validator: (value: Date): boolean => isBefore(value, options),
});

export const emailConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsEmailOptions = {}): EmailConfigFactory<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  validator: (value: string): boolean => isEmail(value, options),
});

export const floatConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsFloatOptions = {}): FloatConfigFactory<O, H, R> => ({
  ...numberConfig(optional, hidden, readOnly),
  sanitizer: optional
    ? (value: unknown): number | undefined => toString(value) ? toFloat(value) : undefined
    : toFloat,
  validator: (value: number): boolean => isFloat(value, options),
} as unknown as FloatConfigFactory<O, H, R>);

export const integerConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsIntegerOptions = {}): IntegerConfigFactory<O, H, R> => ({
  ...numberConfig(optional, hidden, readOnly),
  sanitizer: optional
    ? (value: unknown): number | undefined => toString(value) ? toInteger(value) : undefined
    : toInteger,
  validator: (value: number): boolean => isInteger(value, options),
} as unknown as IntegerConfigFactory<O, H, R>);

export const negativeFloatConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsNegativeFloatOptions = {}): NegativeFloatConfigFactory<O, H, R> => ({
  ...floatConfig(optional, hidden, readOnly),
  validator: (value: number): boolean => isNegativeFloat(value, options),
});

export const negativeIntegerConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsNegativeIntegerOptions = {}): NegativeIntegerConfigFactory<O, H, R> => ({
  ...integerConfig(optional, hidden, readOnly),
  validator: (value: number): boolean => isNegativeInteger(value, options),
});

export const positiveFloatConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsPositiveFloatOptions = {}): PositiveFloatConfigFactory<O, H, R> => ({
  ...floatConfig(optional, hidden, readOnly),
  validator: (value: number): boolean => isPositiveFloat(value, options),
});

export const positiveIntegerConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsPositiveIntegerOptions = {}): PositiveIntegerConfigFactory<O, H, R> => ({
  ...integerConfig(optional, hidden, readOnly),
  validator: (value: number): boolean => isPositiveInteger(value, options),
});

export const urlConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsURLOptions = {}): URLConfigFactory<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  validator: (value: string) => isURL(value, options),
});

export const uuidConfig = <
  O extends boolean,
  H extends boolean,
  R extends boolean
>(optional?: O, hidden?: H, readOnly?: R, options: IsUUIDOptions = {}): UUIDConfigFactory<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  normalizer: optional
    ? (value: string): string | undefined => lowercase(value) || undefined
    : lowercase,
  validator: (value: string) => isUUID(value, options),
} as unknown as UUIDConfigFactory<O, H, R>);
