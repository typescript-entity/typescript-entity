import type { AttrName } from '@typescript-entity/core';
import { lowerCase } from '@typescript-entity/normalizers';
import { isUUID } from '@typescript-entity/validators';
import type { IsUUIDOptions } from '@typescript-entity/validators';
import { string } from './string';
import type { StringAttrConfigFactory } from './string';

export type UUIDAttrConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false
> = StringAttrConfigFactory<Optional, Hidden, Immutable, true, true>;

export const uuid = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: IsUUIDOptions = {}): UUIDAttrConfigFactory<O, H, R> => ({
  ...string(optional, hidden, immutable),
  normalizer: lowerCase,
  validator: (value: string, name: AttrName): boolean => isUUID(value, name, options),
} as unknown as UUIDAttrConfigFactory<O, H, R>);
