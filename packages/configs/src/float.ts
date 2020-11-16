import { Entity } from '@typescript-entity/core';
import type { AttrName } from '@typescript-entity/core';
import { toFloat, toString } from '@typescript-entity/sanitizers';
import { number } from './number';
import type { NumberAttrConfigFactory } from './number';

export type FloatAttrConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = NumberAttrConfigFactory<Optional, Hidden, Immutable, Normalizer, Validator>;

export const float = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R): FloatAttrConfigFactory<O, H, R> => ({
  ...number(optional, hidden, immutable),
  sanitizer: (
    optional
      ? function(this: Entity, value: unknown, name: AttrName): number | null {
        return toString(value) ? toFloat.bind(this)(value, name) : null;
      }
      : toFloat
  ),
} as unknown as FloatAttrConfigFactory<O, H, R>);
