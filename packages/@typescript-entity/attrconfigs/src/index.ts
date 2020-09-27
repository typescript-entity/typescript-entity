import { ValueConfig, WithNormalizer, WithValidator } from '@typescript-entity/core';
import * as Normalizers from '@typescript-entity/normalizers';
import * as Sanitizers from '@typescript-entity/sanitizers';
import * as Validators from '@typescript-entity/validators';

export type DateOfBirthConfig = WithValidator<ValueConfig<Date>>;
export const DATE_OF_BIRTH: DateOfBirthConfig = {
  value: new Date(0),
  sanitizer: Sanitizers.date,
  validator: (value: Date): boolean => value < new Date(),
};

export type EmailConfig = WithValidator<ValueConfig<string>>;
export const EMAIL: EmailConfig = {
  value: '',
  sanitizer: Sanitizers.string,
  validator: Validators.email,
};

export type UUID4Config = WithValidator<WithNormalizer<ValueConfig<string>>>;
export const UUID4: UUID4Config = {
  value: '',
  sanitizer: Sanitizers.string,
  normalizer: Normalizers.lowercase,
  validator: Validators.uuid,
};
