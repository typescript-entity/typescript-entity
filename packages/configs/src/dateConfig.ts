import { toDate, toString } from '@typescript-entity/sanitizers';
import type { ConfigFactory } from './ConfigFactory';

export type DateConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = ConfigFactory<Date, Optional, Hidden, ReadOnly, Normalizer, Validator>;

export const dateConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): DateConfigFactory<O, H, R> => ({
  hidden,
  readOnly,
  value: optional ? undefined : new Date(0),
  sanitizer: (
    optional
      ? (value: unknown): Date | undefined => toString(value) ? toDate(value) : undefined
      : toDate
  ),
} as unknown as DateConfigFactory<O, H, R>);
