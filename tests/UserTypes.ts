import { DateInPastConfigFactory, EmailConfigFactory, UUIDConfigFactory } from '@typescript-entity/configs';
import { BooleanConfigFactory, FnConfigFactory, StringConfigFactory } from '@typescript-entity/core';

export type UserDateOfBirthConfig = DateInPastConfigFactory;

export type UserEmailConfig = EmailConfigFactory;

export type UserEmailDomainConfig = FnConfigFactory<string, true>;

export type UserUUIDConfig = UUIDConfigFactory<true, true, true>;

export type UserUsernameConfig = StringConfigFactory<false, false, false, false, true>;

export type UserVerifiedConfig = BooleanConfigFactory;

export type UserConfigs = {
  date_of_birth: UserDateOfBirthConfig;
  email: UserEmailConfig;
  email_domain: UserEmailDomainConfig;
  uuid: UserUUIDConfig;
  username: UserUsernameConfig;
  verified: UserVerifiedConfig;
};
