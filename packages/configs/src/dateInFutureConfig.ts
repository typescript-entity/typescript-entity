import type { AttrName } from '@typescript-entity/core';
import { isAfter } from '@typescript-entity/validators';
import type { IsAfterOptions } from '@typescript-entity/validators';
import { dateConfig } from './dateConfig';
import type { DateConfigFactory } from './dateConfig';

export type DateInFutureConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = DateConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const dateInFutureConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: IsAfterOptions = {}): DateInFutureConfigFactory<O, H, R> => ({
  ...dateConfig(optional, hidden, immutable),
  validator: (value: Date, name: AttrName): boolean => isAfter(value, name, options),
} as unknown as DateInFutureConfigFactory<O, H, R>);
