import type { AttrName } from '@typescript-entity/core';
import { upperCase } from '@typescript-entity/normalizers';
import { isCountryCode } from '@typescript-entity/validators';
import type { IsCountryCodeOptions } from '@typescript-entity/validators';
import { stringConfig } from './stringConfig';
import type { StringConfigFactory } from './stringConfig';

export type CountryCodeConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
> = StringConfigFactory<Optional, Hidden, Immutable, true, true>;

export const countryCodeConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: IsCountryCodeOptions = {}): CountryCodeConfig<O, H, R> => ({
  ...stringConfig(optional, hidden, immutable),
  normalizer: upperCase,
  validator: (value: string, name: AttrName): boolean => isCountryCode(value, name, options),
} as unknown as CountryCodeConfig<O, H, R>);
