import { DateInPastConfigFactory, EmailConfigFactory, UUIDConfigFactory } from '@typescript-entity/configs';
import { BooleanConfigFactory, FnConfigFactory, StringConfigFactory } from '@typescript-entity/core';

export type DateOfBirthConfig = DateInPastConfigFactory;

export type EmailConfig = EmailConfigFactory;

export type EmailDomainConfig = FnConfigFactory<string, true>;

export type UUIDConfig = UUIDConfigFactory<true, true, true>;

export type UsernameConfig = StringConfigFactory<false, false, false, false, true>;

export type VerifiedConfig = BooleanConfigFactory;

export type UserConfigs = {
  date_of_birth: DateOfBirthConfig;
  email: EmailConfig;
  email_domain: EmailDomainConfig;
  uuid: UUIDConfig;
  username: UsernameConfig;
  verified: VerifiedConfig;
};
