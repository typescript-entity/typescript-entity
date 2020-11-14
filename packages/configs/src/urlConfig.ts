import type { AttrName } from '@typescript-entity/core';
import { isURL } from '@typescript-entity/validators';
import type { IsURLOptions } from '@typescript-entity/validators';
import { stringConfig } from './stringConfig';
import type { StringConfigFactory } from './stringConfig';

export type URLConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = StringConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const urlConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: IsURLOptions = {}): URLConfigFactory<O, H, R> => ({
  ...stringConfig(optional, hidden, immutable),
  validator: (value: string, name: AttrName): boolean => isURL(value, name, options),
} as unknown as URLConfigFactory<O, H, R>);
