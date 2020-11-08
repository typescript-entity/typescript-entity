import type { ConfigFactory } from './ConfigFactory';
import { toString } from '@typescript-entity/sanitizers';

export type StringConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = ConfigFactory<string, Optional, Hidden, ReadOnly, Normalizer, Validator>;

export const stringConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): StringConfigFactory<O, H, R> => ({
  hidden,
  readOnly,
  value: optional ? undefined : '',
  sanitizer: (
    optional
      ? (value: unknown): string | undefined => toString(value) || undefined
      : toString
  ),
} as unknown as StringConfigFactory<O, H, R>);
