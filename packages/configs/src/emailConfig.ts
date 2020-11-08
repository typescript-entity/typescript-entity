import { isEmail } from '@typescript-entity/validators';
import type { IsEmailOptions } from '@typescript-entity/validators';
import { stringConfig } from './stringConfig';
import type { StringConfigFactory } from './stringConfig';

export type EmailConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = StringConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export const emailConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsEmailOptions = {}): EmailConfigFactory<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  validator: (value: string): boolean => isEmail(value, options),
});
