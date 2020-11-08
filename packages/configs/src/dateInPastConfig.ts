import { isBefore } from '@typescript-entity/validators';
import type { IsBeforeOptions } from '@typescript-entity/validators';
import { dateConfig } from './dateConfig';
import type { DateConfigFactory } from './dateConfig';

export type DateInPastConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = DateConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export const dateInPastConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsBeforeOptions = {}): DateInPastConfigFactory<O, H, R> => ({
  ...dateConfig(optional, hidden, readOnly),
  validator: (value: Date): boolean => isBefore(value, options),
});
