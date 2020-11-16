import type { AttrName } from '@typescript-entity/core';
import { isAfter } from '@typescript-entity/validators';
import type { IsAfterOptions } from '@typescript-entity/validators';
import { date } from './date';
import type { DateAttrConfigFactory } from './date';

export type DateInFutureAttrConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = DateAttrConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const dateInFuture = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: IsAfterOptions = {}): DateInFutureAttrConfigFactory<O, H, R> => ({
  ...date(optional, hidden, immutable),
  validator: (value: Date, name: AttrName): boolean => isAfter(value, name, options),
} as unknown as DateInFutureAttrConfigFactory<O, H, R>);
