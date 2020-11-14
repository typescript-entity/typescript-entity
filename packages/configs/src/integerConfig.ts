import { Entity } from '@typescript-entity/core';
import type { AttrName } from '@typescript-entity/core';
import { toInteger, toString } from '@typescript-entity/sanitizers';
import { numberConfig } from './numberConfig';
import type { NumberConfigFactory } from './numberConfig';

export type IntegerConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = NumberConfigFactory<Optional, Hidden, Immutable, Normalizer, Validator>;

export const integerConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R): IntegerConfigFactory<O, H, R> => ({
  ...numberConfig(optional, hidden, immutable),
  sanitizer: (
    optional
      ? function(this: Entity, value: unknown, name: AttrName): number | null {
        return toString(value) ? toInteger.bind(this)(value, name) : null;
      }
      : toInteger
  ),
} as unknown as IntegerConfigFactory<O, H, R>);
