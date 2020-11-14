import { booleanConfig, callableConfig, dateInPastConfig, emailConfig, stringConfig, uuidConfig } from '../packages/configs/src/';
import type { BooleanConfigFactory, CallableAttrConfigFactory, DateInPastConfigFactory, EmailConfigFactory, StringConfigFactory, UUIDConfigFactory } from '../packages/configs/src/';
import { entity } from '../packages/core/src/';
import type { AttrName } from '../packages/core/src/';
import { isLength } from '../packages/validators/src/';

export type UserDateOfBirthConfig = DateInPastConfigFactory;

export type UserEmailConfig = EmailConfigFactory;

export type UserEmailDomainConfig = CallableAttrConfigFactory<string, true>;

export type UserUUIDConfig = UUIDConfigFactory<true, true, true>;

export type UserUsernameConfig = StringConfigFactory<false, false, false, false, true>;

export type UserVerifiedConfig = BooleanConfigFactory<false, false, true>;

export type UserAttrConfigSet = {
  date_of_birth: UserDateOfBirthConfig;
  email: UserEmailConfig;
  email_domain: UserEmailDomainConfig;
  uuid: UserUUIDConfig;
  username: UserUsernameConfig;
  verified: UserVerifiedConfig;
};

export type User = InstanceType<typeof User>;

export const UserAttrConfigSet: UserAttrConfigSet = {
  date_of_birth: dateInPastConfig(),
  email: emailConfig(),
  email_domain: callableConfig(function(this: User): string | null { return this.email.split('@', 2)[1] || null }),
  uuid: uuidConfig(true, true, true),
  username: {
    ...stringConfig(),
    validator: (value: string, name: AttrName): boolean => isLength(value, name, { min: 5 }),
  },
  verified: booleanConfig(false, false, true),
};

export const User = entity(UserAttrConfigSet);
