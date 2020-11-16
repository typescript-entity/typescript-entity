import type { AttrName } from '@typescript-entity/core';
import { isURL } from '@typescript-entity/validators';
import type { IsURLOptions } from '@typescript-entity/validators';
import { string } from './string';
import type { StringAttrConfigFactory } from './string';

export type URLAttrConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = StringAttrConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const url = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: IsURLOptions = {}): URLAttrConfigFactory<O, H, R> => ({
  ...string(optional, hidden, immutable),
  validator: (value: string, name: AttrName): boolean => isURL(value, name, options),
} as unknown as URLAttrConfigFactory<O, H, R>);
