import type { AttrName } from '@typescript-entity/core';
import { upperCase } from '@typescript-entity/normalizers';
import { isCountryCode } from '@typescript-entity/validators';
import type { IsCountryCodeOptions } from '@typescript-entity/validators';
import { string } from './string';
import type { StringAttrConfigFactory } from './string';

export type CountryCodeAttrConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
> = StringAttrConfigFactory<Optional, Hidden, Immutable, true, true>;

export const countryCode = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R, options: IsCountryCodeOptions = {}): CountryCodeAttrConfigFactory<O, H, R> => ({
  ...string(optional, hidden, immutable),
  normalizer: upperCase,
  validator: (value: string, name: AttrName): boolean => isCountryCode(value, name, options),
} as unknown as CountryCodeAttrConfigFactory<O, H, R>);
