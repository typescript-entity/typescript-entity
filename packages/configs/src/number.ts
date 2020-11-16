import { Entity } from '@typescript-entity/core';
import type { AttrName } from '@typescript-entity/core';
import { toNumber, toString } from '@typescript-entity/sanitizers';
import type { WritableAttrConfigFactory } from './writable';

export type NumberAttrConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = WritableAttrConfigFactory<number, Optional, Hidden, Immutable, Normalizer, Validator>;

export const number = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R): NumberAttrConfigFactory<O, H, R> => ({
  hidden,
  immutable,
  value: optional ? null : 0,
  sanitizer: (
    optional
      ? function(this: Entity, value: unknown, name: AttrName): number | null {
        return toString(value) ? toNumber.bind(this)(value, name) : null;
      }
      : toNumber
  ),
} as unknown as NumberAttrConfigFactory<O, H, R>);
