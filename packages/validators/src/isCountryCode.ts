import validator from 'validator';

export interface IsCountryCodeOptions {
  alpha3?: boolean;
}

export const isCountryCode = (value: string, options: IsCountryCodeOptions = {}): boolean => (
  options.alpha3 ? validator.isISO31661Alpha3(value) : validator.isISO31661Alpha2(value)
);
