import { AsHidden, AsOptional, AsReadOnly, Entity, EntityConstructorAttrs, EntityInterface, FnConfig, ValueConfig, WithValidator } from '@typescript-entity/core';
import { DateOfBirthConfig, EmailConfig, UUID4Config } from '@typescript-entity/configs';
import { boolean as booleanSanitizer, string as stringSanitizer } from '@typescript-entity/sanitizers';
import { boolean as booleanValidator, string as stringValidator } from '@typescript-entity/validators';

export type UserConfigs = {
  date_of_birth: DateOfBirthConfig & ThisType<User>;
  email: EmailConfig & ThisType<User>;
  email_domain: FnConfig<string> & ThisType<User>;
  username: WithValidator<ValueConfig<string>> & ThisType<User>;
  uuid: AsHidden<AsReadOnly<AsOptional<UUID4Config>>> & ThisType<User>;
  verified: WithValidator<ValueConfig<boolean>> & ThisType<User>;
};

export class User extends Entity<UserConfigs> implements EntityInterface<UserConfigs> {

  public static readonly CONFIGS: UserConfigs = {
    date_of_birth: DateOfBirthConfig,
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
      sanitizer: stringSanitizer,
      validator: (value: string): boolean => stringValidator(value, { min: 5 }),
    },
    verified: {
      value: false,
      sanitizer: booleanSanitizer,
      validator: booleanValidator,
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
