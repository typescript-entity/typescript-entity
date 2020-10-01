import { ValidatorFn, ValueFn } from '@typescript-entity/core/src';
import { lowercase } from '@typescript-entity/normalizers';
import { toBoolean, toDate, toFloat, toInteger, toNumber, toString } from '@typescript-entity/sanitizers';
import { isAfter, isBefore, isEmail, isFloat, isInteger, isURL, isUUID } from '@typescript-entity/validators';
import { BooleanConfigFactory, DateConfigFactory, FnConfigFactory, NumberConfigFactory, StringConfigFactory } from './Types';

export const booleanConfigFactory = <
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
} as unknown as BooleanConfigFactory<O, H, R>);

export const dateConfigFactory = <
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
} as unknown as DateConfigFactory<O, H, R>);

export const fnConfigFactory = <
  F extends ValueFn,
  O extends boolean = false,
  H extends boolean = false,
  T = ReturnType<F>
>(value: F, optional?: O, hidden?: H): FnConfigFactory<T, O, H> => ({
  value,
  hidden,
} as unknown as FnConfigFactory<T, O, H>);

export const numberConfigFactory = <
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
} as unknown as NumberConfigFactory<O, H, R>);

export const stringConfigFactory = <
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
} as unknown as StringConfigFactory<O, H, R>);

export const dateInPastConfigFactory = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): DateConfigFactory<O, H, R> => ({
  ...dateConfigFactory(optional, hidden, readOnly),
  validator: isBefore,
});

export const dateInFutureConfigFactory = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): DateConfigFactory<O, H, R> => ({
  ...dateConfigFactory(optional, hidden, readOnly),
  validator: isAfter,
});

export const emailConfigFactory = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): StringConfigFactory<O, H, R> => ({
  ...stringConfigFactory(optional, hidden, readOnly),
  validator: isEmail,
});

export const floatConfigFactory = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): NumberConfigFactory<O, H, R> => ({
  ...numberConfigFactory(optional, hidden, readOnly),
  sanitizer: optional
    ? (value: unknown): number | undefined => toString(value) ? toFloat(value) : undefined
    : toFloat,
  validator: isFloat,
});

export const integerConfigFactory = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): NumberConfigFactory<O, H, R> => ({
  ...numberConfigFactory(optional, hidden, readOnly),
  sanitizer: optional
    ? (value: unknown): number | undefined => toString(value) ? toInteger(value) : undefined
    : toInteger,
  validator: isInteger,
});

export const urlConfigFactory = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): StringConfigFactory<O, H, R> => ({
  ...stringConfigFactory(optional, hidden, readOnly),
  validator: isURL,
});

export const uuid4ConfigFactory = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): StringConfigFactory<O, H, R> => ({
  ...stringConfigFactory(optional, hidden, readOnly),
  normalizer: optional
    ? (value: string): string | undefined => lowercase(value) || undefined
    : lowercase,
  validator: isUUID,
});
