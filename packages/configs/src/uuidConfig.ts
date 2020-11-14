import type { AttrName } from '@typescript-entity/core';
import { lowerCase } from '@typescript-entity/normalizers';
import { isUUID } from '@typescript-entity/validators';
import type { IsUUIDOptions } from '@typescript-entity/validators';
import { stringConfig } from './stringConfig';
import type { StringConfigFactory } from './stringConfig';

export type UUIDConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false
> = StringConfigFactory<Optional, Hidden, Immutable, true, true>;

export const uuidConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: IsUUIDOptions = {}): UUIDConfigFactory<O, H, R> => ({
  ...stringConfig(optional, hidden, immutable),
  normalizer: lowerCase,
  validator: (value: string, name: AttrName): boolean => isUUID(value, name, options),
} as unknown as UUIDConfigFactory<O, H, R>);
