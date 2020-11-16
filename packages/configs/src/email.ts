import type { AttrName } from '@typescript-entity/core';
import { isEmail } from '@typescript-entity/validators';
import type { IsEmailOptions } from '@typescript-entity/validators';
import { string } from './string';
import type { StringAttrConfigFactory } from './string';

export type EmailAttrConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = StringAttrConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const email = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: IsEmailOptions = {}): EmailAttrConfigFactory<O, H, R> => ({
  ...string(optional, hidden, immutable),
  validator: (value: string, name: AttrName): boolean => isEmail(value, name, options),
} as unknown as EmailAttrConfigFactory<O, H, R>);
