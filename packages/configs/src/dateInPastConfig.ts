import type { AttrName } from '@typescript-entity/core';
import { isBefore } from '@typescript-entity/validators';
import type { IsBeforeOptions } from '@typescript-entity/validators';
import { dateConfig } from './dateConfig';
import type { DateConfigFactory } from './dateConfig';

export type DateInPastConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = DateConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const dateInPastConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: IsBeforeOptions = {}): DateInPastConfigFactory<O, H, R> => ({
  ...dateConfig(optional, hidden, immutable),
  validator: (value: Date, name: AttrName): boolean => isBefore(value, name, options),
} as unknown as DateInPastConfigFactory<O, H, R>);
