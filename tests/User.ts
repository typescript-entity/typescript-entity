import { booleanConfig, dateInPastConfig, DateInPastConfigFactory, emailConfig, EmailConfigFactory, fnConfig, stringConfig, uuidConfig, UUIDConfigFactory } from '@typescript-entity/configs';
import { Attr, Attrs, BooleanConfigFactory, Entity, FnConfigFactory, StringConfigFactory, ValueAttrs } from '@typescript-entity/core';
import { isLength } from '@typescript-entity/validators';

export type UserConfigs = {
  date_of_birth: DateInPastConfigFactory;
  email: EmailConfigFactory;
  email_domain: FnConfigFactory<string, true>;
  uuid: UUIDConfigFactory<true, true, true>;
  username: StringConfigFactory<false, false, false, false, true>;
  verified: BooleanConfigFactory;
};

export class User extends Entity<UserConfigs> implements Attrs<UserConfigs> {

  public static readonly CONFIGS: UserConfigs = {
    date_of_birth: dateInPastConfig(),
    email: emailConfig(),
    email_domain: fnConfig(function(this: User): string | undefined { return this.email.split('@', 2)[1] || undefined }),
    uuid: uuidConfig(true, true, true),
    username: {
      ...stringConfig(),
      validator: (value: string): boolean => isLength(value, { min: 5 }),
    },
    verified: booleanConfig(),
  };

  constructor(attrs: Partial<ValueAttrs<UserConfigs>> = {}) {
    super(User.CONFIGS, attrs);
  }

  get date_of_birth(): Attr<UserConfigs['date_of_birth']> {
    return this.get('date_of_birth');
  }

  set date_of_birth(value: Attr<UserConfigs['date_of_birth']>) {
    this.set('date_of_birth', value);
  }

  get email(): Attr<UserConfigs['email']> {
    return this.get('email');
  }

  set email(value: Attr<UserConfigs['email']>) {
    this.set('email', value);
  }

  get email_domain(): Attr<UserConfigs['email_domain']> {
    return this.get('email_domain');
  }

  get uuid(): Attr<UserConfigs['uuid']> {
    return this.get('uuid');
  }

  get username(): Attr<UserConfigs['username']> {
    return this.get('username');
  }

  set username(value: Attr<UserConfigs['username']>) {
    this.set('username', value);
  }

  get verified(): Attr<UserConfigs['verified']> {
    return this.get('verified');
  }

  set verified(value: Attr<UserConfigs['verified']>) {
    this.set('verified', value);
  }

  public exposedFillReadOnly<A extends Partial<ValueAttrs<UserConfigs>>>(attrs: A): this {
    return this.fillReadOnly(attrs);
  }

}
