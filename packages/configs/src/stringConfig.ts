import { toString } from '@typescript-entity/sanitizers';
import type { WritableAttrConfigFactory } from './AttrConfigFactory';

export type StringConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = WritableAttrConfigFactory<string, Optional, Hidden, Immutable, Normalizer, Validator>;

export const stringConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R): StringConfigFactory<O, H, R> => ({
  hidden,
  immutable,
  value: optional ? null : '',
  sanitizer: (
    optional
      ? (value: unknown): string | null => toString(value) || null
      : toString
  ),
} as unknown as StringConfigFactory<O, H, R>);
