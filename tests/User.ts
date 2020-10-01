import { booleanConfig, BooleanConfig, DateConfig, dateInPastConfig, emailConfig, fnConfig, FnConfig, stringConfig, StringConfig, uuid4Config } from '@typescript-entity/configs';
import { Attr, Attrs, Entity, ValueAttrs } from '@typescript-entity/core';
import { isLength } from '@typescript-entity/validators';

export type UserConfigs = {
  date_of_birth: DateConfig;
  email: StringConfig;
  email_domain: FnConfig<string>;
  uuid: StringConfig<true, true, true>;
  username: StringConfig;
  verified: BooleanConfig;
};

export class User extends Entity<UserConfigs> implements Attrs<UserConfigs> {

  public static readonly CONFIGS = {
    date_of_birth: dateInPastConfig(),
    email: emailConfig(),
    email_domain: fnConfig(function(this: User): string { return this.email.split('@', 2)[1] || '' }),
    uuid: uuid4Config(true, true, true),
    username: {
      ...stringConfig(),
      validator: (value: string): boolean => isLength(value, { min: 5 }),
    },
    verified: booleanConfig(),
  };

  constructor(attrs: Partial<ValueAttrs<UserConfigs>> = {}) {
    super(User.CONFIGS, attrs);
  }

  get date_of_birth(): Attr<UserConfigs, 'date_of_birth'> {
    return this.get('date_of_birth');
  }

  set date_of_birth(value: Attr<UserConfigs, 'date_of_birth'>) {
    this.set('date_of_birth', value);
  }

  get email(): Attr<UserConfigs, 'email'> {
    return this.get('email');
  }

  set email(value: Attr<UserConfigs, 'email'>) {
    this.set('email', value);
  }

  get email_domain(): Attr<UserConfigs, 'email_domain'> {
    return this.get('email_domain');
  }

  get uuid(): Attr<UserConfigs, 'uuid'> {
    return this.get('uuid');
  }

  get username(): Attr<UserConfigs, 'username'> {
    return this.get('username');
  }

  set username(value: Attr<UserConfigs, 'username'>) {
    this.set('username', value);
  }

  get verified(): Attr<UserConfigs, 'verified'> {
    return this.get('verified');
  }

  set verified(value: Attr<UserConfigs, 'verified'>) {
    this.set('verified', value);
  }

  public exposedFillReadOnly<A extends Partial<ValueAttrs<UserConfigs>>>(attrs: A): this {
    return this.fillReadOnly(attrs);
  }

}
