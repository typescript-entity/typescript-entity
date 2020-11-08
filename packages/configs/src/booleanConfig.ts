import type { ConfigFactory } from './ConfigFactory';
import { toBoolean, toString } from '@typescript-entity/sanitizers';
import type { ToBooleanOptions } from '@typescript-entity/sanitizers';

export type BooleanConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = ConfigFactory<boolean, Optional, Hidden, ReadOnly, Normalizer, Validator>;

export const booleanConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: ToBooleanOptions = {}): BooleanConfigFactory<O, H, R> => ({
  hidden,
  readOnly,
  value: optional ? undefined : false,
  sanitizer: (
    optional
      ? (value: unknown): boolean | undefined => toString(value) ? toBoolean(value, options) : undefined
      : (value: unknown): boolean => toBoolean(value, options)
  ),
} as unknown as BooleanConfigFactory<O, H, R>);
