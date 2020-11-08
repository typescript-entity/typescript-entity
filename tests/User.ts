import { booleanConfig, dateInPastConfig, emailConfig, fnConfig, stringConfig, uuidConfig } from '../packages/configs/src/';
import type { BooleanConfigFactory, DateInPastConfigFactory, EmailConfigFactory, FnConfigFactory, StringConfigFactory, UUIDConfigFactory } from '../packages/configs/src/';
import { Entity } from '../packages/core/src/';
import type { Attr, Attrs, InitialAttrs } from '../packages/core/src/';
import { isLength } from '../packages/validators/src/';

export type UserDateOfBirthConfig = DateInPastConfigFactory;

export type UserEmailConfig = EmailConfigFactory;

export type UserEmailDomainConfig = FnConfigFactory<string, true>;

export type UserUUIDConfig = UUIDConfigFactory<true, true, true>;

export type UserUsernameConfig = StringConfigFactory<false, false, false, false, true>;

export type UserVerifiedConfig = BooleanConfigFactory<false, false, true>;

export type UserConfigs = {
  date_of_birth: UserDateOfBirthConfig;
  email: UserEmailConfig;
  email_domain: UserEmailDomainConfig;
  uuid: UserUUIDConfig;
  username: UserUsernameConfig;
  verified: UserVerifiedConfig;
};

export const CONFIGS: UserConfigs = {
  date_of_birth: dateInPastConfig(),
  email: emailConfig(),
  email_domain: fnConfig(function(this: User): string | undefined { return this.email.split('@', 2)[1] || undefined }, true),
  uuid: uuidConfig(true, true, true),
  username: {
    ...stringConfig(),
    validator: (value: string): boolean => isLength(value, { min: 5 }),
  },
  verified: booleanConfig(false, false, true),
};

export class User extends Entity<UserConfigs> implements Attrs<UserConfigs> {

  constructor(attrs: InitialAttrs<UserConfigs> = {}) {
    super(CONFIGS, attrs);
  }

  get date_of_birth(): Attr<UserConfigs, 'date_of_birth'> {
    return this.one('date_of_birth');
  }

  set date_of_birth(value: Attr<UserConfigs, 'date_of_birth'>) {
    this.set('date_of_birth', value);
  }

  get email(): Attr<UserConfigs, 'email'> {
    return this.one('email');
  }

  set email(value: Attr<UserConfigs, 'email'>) {
    this.set('email', value);
  }

  get email_domain(): Attr<UserConfigs, 'email_domain'> {
    return this.one('email_domain');
  }

  get uuid(): Attr<UserConfigs, 'uuid'> {
    return this.one('uuid');
  }

  get username(): Attr<UserConfigs, 'username'> {
    return this.one('username');
  }

  set username(value: Attr<UserConfigs, 'username'>) {
    this.set('username', value);
  }

  get verified(): Attr<UserConfigs, 'verified'> {
    return this.one('verified');
  }

}
