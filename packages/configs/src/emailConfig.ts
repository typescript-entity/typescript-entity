import type { AttrName } from '@typescript-entity/core';
import { isEmail } from '@typescript-entity/validators';
import type { IsEmailOptions } from '@typescript-entity/validators';
import { stringConfig } from './stringConfig';
import type { StringConfigFactory } from './stringConfig';

export type EmailConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = StringConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const emailConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: IsEmailOptions = {}): EmailConfigFactory<O, H, R> => ({
  ...stringConfig(optional, hidden, immutable),
  validator: (value: string, name: AttrName): boolean => isEmail(value, name, options),
} as unknown as EmailConfigFactory<O, H, R>);
