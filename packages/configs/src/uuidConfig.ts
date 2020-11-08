import { lowerCase } from '@typescript-entity/normalizers';
import { isUUID } from '@typescript-entity/validators';
import type { IsUUIDOptions } from '@typescript-entity/validators';
import { stringConfig } from './stringConfig';
import type { StringConfigFactory } from './stringConfig';

export type UUIDConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false
> = StringConfigFactory<Optional, Hidden, ReadOnly, true, true>;

export const uuidConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsUUIDOptions = {}): UUIDConfigFactory<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  normalizer: lowerCase,
  validator: (value: string): boolean => isUUID(value, options),
} as unknown as UUIDConfigFactory<O, H, R>);
