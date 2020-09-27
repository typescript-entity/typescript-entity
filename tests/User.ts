import { AsHidden, AsOptional, AsReadOnly, Entity, EntityConstructorAttrs, EntityInterface, FnConfig, ValueConfig, WithValidator } from '@typescript-entity/core';
import { DateInPastConfig, EmailConfig, UUID4Config } from '@typescript-entity/configs';
import { toBoolean, toString } from '@typescript-entity/sanitizers';
import { isLength } from '@typescript-entity/validators';

export type UserConfigs = {
  date_of_birth: DateInPastConfig & ThisType<User>;
  email: EmailConfig & ThisType<User>;
  email_domain: FnConfig<string> & ThisType<User>;
  username: WithValidator<ValueConfig<string>> & ThisType<User>;
  uuid: AsHidden<AsReadOnly<AsOptional<UUID4Config>>> & ThisType<User>;
  verified: ValueConfig<boolean> & ThisType<User>;
};

export class User extends Entity<UserConfigs> implements EntityInterface<UserConfigs> {

  public static readonly CONFIGS: UserConfigs = {
    date_of_birth: DateInPastConfig,
    email: EmailConfig,
    email_domain: {
      fn: function(this: User): string { return this.email.split('@', 2)[1] || '' },
    },
    uuid: {
      ...UUID4Config,
      value: undefined,
      hidden: true,
      readOnly: true,
    },
    username: {
      value: '',
      sanitizer: toString,
      validator: (value: string): boolean => isLength(value, { min: 5 }),
    },
    verified: {
      value: false,
      sanitizer: toBoolean,
    },
  };

  constructor(attrs: EntityConstructorAttrs<UserConfigs> = {}) {
    super(User.CONFIGS, attrs);
  }

  get date_of_birth(): UserConfigs['date_of_birth']['value'] {
    return this.get('date_of_birth');
  }

  set date_of_birth(value: UserConfigs['date_of_birth']['value']) {
    this.set('date_of_birth', value);
  }

  get email(): UserConfigs['email']['value'] {
    return this.get('email');
  }

  set email(value: UserConfigs['email']['value']) {
    this.set('email', value);
  }

  get email_domain(): ReturnType<UserConfigs['email_domain']['fn']> {
    return this.get('email_domain');
  }

  get uuid(): UserConfigs['uuid']['value'] {
    return this.get('uuid');
  }

  get username(): UserConfigs['username']['value'] {
    return this.get('username');
  }

  set username(value: UserConfigs['username']['value']) {
    this.set('username', value);
  }

  get verified(): UserConfigs['verified']['value'] {
    return this.get('verified');
  }

  set verified(value: UserConfigs['verified']['value']) {
    this.set('verified', value);
  }

}
