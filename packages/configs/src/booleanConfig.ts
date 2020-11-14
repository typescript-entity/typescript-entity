import type { AttrName } from '@typescript-entity/core';
import { toBoolean, toString } from '@typescript-entity/sanitizers';
import type { ToBooleanOptions } from '@typescript-entity/sanitizers';
import type { WritableAttrConfigFactory } from './AttrConfigFactory';

export type BooleanConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = WritableAttrConfigFactory<boolean, Optional, Hidden, Immutable, Normalizer, Validator>;

export const booleanConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: ToBooleanOptions = {}): BooleanConfigFactory<O, H, R> => ({
  hidden,
  immutable,
  value: optional ? null : false,
  sanitizer: (
    optional
      ? (value: unknown, name: AttrName): boolean | null => toString(value) ? toBoolean(value, name, options) : null
      : (value: unknown, name: AttrName): boolean => toBoolean(value, name, options)
  ),
} as unknown as BooleanConfigFactory<O, H, R>);
