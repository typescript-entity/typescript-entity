import type { AttrName } from '@typescript-entity/core';
import { isBefore } from '@typescript-entity/validators';
import type { IsBeforeOptions } from '@typescript-entity/validators';
import { date } from './date';
import type { DateAttrConfigFactory } from './date';

export type DateInPastAttrConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = DateAttrConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const dateInPast = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: IsBeforeOptions = {}): DateInPastAttrConfigFactory<O, H, R> => ({
  ...date(optional, hidden, immutable),
  validator: (value: Date, name: AttrName): boolean => isBefore(value, name, options),
} as unknown as DateInPastAttrConfigFactory<O, H, R>);
