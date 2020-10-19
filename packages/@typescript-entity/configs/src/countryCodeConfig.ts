import { upperCase } from "@typescript-entity/normalizers";
import { isCountryCode } from "@typescript-entity/validators";
import type { IsCountryCodeOptions } from "@typescript-entity/validators";
import { stringConfig } from "./stringConfig";
import type { StringConfigFactory } from "./stringConfig";

export type CountryCodeConfig<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
> = StringConfigFactory<Optional, Hidden, ReadOnly, true, true>;

export const countryCodeConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsCountryCodeOptions = {}): CountryCodeConfig<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  normalizer: upperCase,
  validator: (value: string): boolean => isCountryCode(value, options),
});
