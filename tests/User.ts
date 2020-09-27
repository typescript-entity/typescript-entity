import { AsHidden, AsOptional, AsReadOnly, Entity, EntityConstructorAttrs, EntityInterface, FnConfig, ValueConfig, WithValidator } from '@typescript-entity/core';
import * as Configs from '@typescript-entity/configs';
import * as Sanitizers from '@typescript-entity/sanitizers';
import * as Validators from '@typescript-entity/validators';

export type UserConfigs = {
  date_of_birth: Configs.DateOfBirthConfig & ThisType<User>;
  email: Configs.EmailConfig & ThisType<User>;
  email_domain: FnConfig<string> & ThisType<User>;
  username: WithValidator<ValueConfig<string>> & ThisType<User>;
  uuid: AsHidden<AsReadOnly<AsOptional<Configs.UUID4Config>>> & ThisType<User>;
  verified: WithValidator<ValueConfig<boolean>> & ThisType<User>;
};

export const CONFIGS:UserConfigs = {
  date_of_birth: Configs.DATE_OF_BIRTH,
  email: Configs.EMAIL,
  email_domain: {
    fn: function(this: User): string { return this.email.split('@', 2)[1] || '' },
  },
  uuid: {
    ...Configs.UUID4,
    value: undefined,
    hidden: true,
    readOnly: true,
  },
  username: {
    value: '',
    sanitizer: Sanitizers.string,
    validator: (value: string): boolean => Validators.string(value, { min: 5 }),
  },
  verified: {
    value: false,
    sanitizer: Sanitizers.boolean,
    validator: Validators.boolean,
  },
};

export class User extends Entity<UserConfigs> implements EntityInterface<UserConfigs> {

  constructor(attrs: EntityConstructorAttrs<UserConfigs> = {}) {
    super(CONFIGS, attrs);
  }

  get date_of_birth(): Date {
    return this.get('date_of_birth');
  }

  set date_of_birth(value: Date) {
    this.set('date_of_birth', value);
  }

  get email(): string {
    return this.get('email');
  }

  set email(value: string) {
    this.set('email', value);
  }

  get email_domain(): string {
    return this.get('email_domain');
  }

  get uuid(): string | undefined {
    return this.get('uuid');
  }

  get username(): string {
    return this.get('username');
  }

  set username(value: string) {
    this.set('username', value);
  }

  get verified(): boolean {
    return this.get('verified');
  }

  set verified(value: boolean) {
    this.set('verified', value);
  }

}
