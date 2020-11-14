import { Entity } from '@typescript-entity/core';
import type { AttrName } from '@typescript-entity/core';
import { toFloat, toString } from '@typescript-entity/sanitizers';
import { numberConfig } from './numberConfig';
import type { NumberConfigFactory } from './numberConfig';

export type FloatConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = NumberConfigFactory<Optional, Hidden, Immutable, Normalizer, Validator>;

export const floatConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R): FloatConfigFactory<O, H, R> => ({
  ...numberConfig(optional, hidden, immutable),
  sanitizer: (
    optional
      ? function(this: Entity, value: unknown, name: AttrName): number | null {
        return toString(value) ? toFloat.bind(this)(value, name) : null;
      }
      : toFloat
  ),
} as unknown as FloatConfigFactory<O, H, R>);
