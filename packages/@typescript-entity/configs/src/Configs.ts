import { ValueFn } from '@typescript-entity/core/src';
import { lowercase } from '@typescript-entity/normalizers';
import { toBoolean, toDate, toFloat, toInteger, toNumber, toString } from '@typescript-entity/sanitizers';
import { isAfter, isBefore, isEmail, isFloat, isInteger, isURL, isUUID } from '@typescript-entity/validators';
import { BooleanConfig, ConfigFactoryEffectiveValue, DateConfig, FnConfig, NumberConfig, StringConfig } from './Types';

export const booleanConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false,
  T extends ConfigFactoryEffectiveValue<boolean, O> = ConfigFactoryEffectiveValue<boolean, O>
>(optional?: O, hidden?: H, readOnly?: R): BooleanConfig<O, H, R> => ({
  hidden,
  readOnly,
  value: (optional ? undefined : false) as T,
  sanitizer: optional
    ? (value: unknown): boolean | undefined => toString(value) ? toBoolean(value) : undefined
    : toBoolean,
} as BooleanConfig<O, H, R>);

export const dateConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false,
  T extends ConfigFactoryEffectiveValue<Date, O> = ConfigFactoryEffectiveValue<Date, O>
>(optional?: O, hidden?: H, readOnly?: R): DateConfig<O, H, R> => ({
  hidden,
  readOnly,
  value: (optional ? undefined : new Date(0)) as T,
  sanitizer: optional
    ? (value: unknown): Date | undefined => toString(value) ? toDate(value) : undefined
    : toDate,
} as unknown as DateConfig<O, H, R>); // TODO: why type cast?

export const fnConfig = <F extends ValueFn>(fn: F): FnConfig<ReturnType<F>> => ({
  value: fn,
});

export const numberConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false,
  T extends ConfigFactoryEffectiveValue<number, O> = ConfigFactoryEffectiveValue<number, O>
>(optional?: O, hidden?: H, readOnly?: R): NumberConfig<O, H, R> => ({
  hidden,
  readOnly,
  value: (optional ? undefined : 0) as T,
  sanitizer: optional
    ? (value: unknown): number | undefined => toString(value) ? toNumber(value) : undefined
    : toNumber,
} as unknown as NumberConfig<O, H, R>); // TODO: why type cast?

export const stringConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false,
  T extends ConfigFactoryEffectiveValue<string, O> = ConfigFactoryEffectiveValue<string, O>
>(optional?: O, hidden?: H, readOnly?: R): StringConfig<O, H, R> => ({
  hidden,
  readOnly,
  value: (optional ? undefined : '') as T,
  sanitizer: optional
    ? (value: unknown): string | undefined => toString(value) || undefined
    : toString,
} as unknown as StringConfig<O, H, R>); // TODO: why type cast?

export const dateInPastConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): DateConfig<O, H, R> => ({
  ...dateConfig(optional, hidden, readOnly),
  validator: isBefore,
});

export const dateInFutureConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): DateConfig<O, H, R> => ({
  ...dateConfig(optional, hidden, readOnly),
  validator: isAfter,
});

export const emailConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): StringConfig<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  validator: isEmail,
});

export const floatConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): NumberConfig<O, H, R> => ({
  ...numberConfig(optional, hidden, readOnly),
  sanitizer: optional
    ? (value: unknown): number | undefined => toString(value) ? toFloat(value) : undefined
    : toFloat,
  validator: isFloat,
});

export const integerConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): NumberConfig<O, H, R> => ({
  ...numberConfig(optional, hidden, readOnly),
  sanitizer: optional
    ? (value: unknown): number | undefined => toString(value) ? toInteger(value) : undefined
    : toInteger,
  validator: isInteger,
});

export const urlConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): StringConfig<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  validator: isURL,
});

export const uuid4Config = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): StringConfig<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  normalizer: optional
    ? (value: string): string | undefined => lowercase(value) || undefined
    : lowercase,
  validator: isUUID,
});
