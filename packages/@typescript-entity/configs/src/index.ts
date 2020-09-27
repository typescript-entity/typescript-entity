import { ValueConfig, WithNormalizer, WithValidator } from '@typescript-entity/core';
import { lowercase as lowercaseNormalizer } from '@typescript-entity/normalizers';
import { date as dateSanitizer, string as stringSanitizer } from '@typescript-entity/sanitizers';
import { email as emailValidator, url as urlValidator, uuid as uuidValidator } from '@typescript-entity/validators';

export type DateOfBirthConfig = WithValidator<ValueConfig<Date>>;
export const DateOfBirthConfig: DateOfBirthConfig = {
  value: new Date(0),
  sanitizer: dateSanitizer,
  validator: (value: Date): boolean => value < new Date(),
};

export type EmailConfig = WithValidator<ValueConfig<string>>;
export const EmailConfig: EmailConfig = {
  value: '',
  sanitizer: stringSanitizer,
  validator: emailValidator,
};

export type URLConfig = WithValidator<ValueConfig<string>>;
export const URLConfig: URLConfig = {
  value: '',
  sanitizer: stringSanitizer,
  validator: urlValidator,
};

export type UUID4Config = WithValidator<WithNormalizer<ValueConfig<string>>>;
export const UUID4Config: UUID4Config = {
  value: '',
  sanitizer: stringSanitizer,
  normalizer: lowercaseNormalizer,
  validator: uuidValidator,
};
