import { AsHidden, AsOptional, AsReadOnly, Entity, EntityConstructorAttrs, EntityInterface, FnConfig, ValueConfig, WithNormalizer, WithValidator } from '@typescript-entity/core';
import * as Normalizers from '@typescript-entity/normalizers';
import * as Sanitizers from '@typescript-entity/sanitizers';
import * as Validators from '@typescript-entity/validators';

export type DateOfBirthConfig = WithValidator<ValueConfig<Date>>;
export type EmailConfig = WithValidator<ValueConfig<string>>;
export type EmailDomainConfig = FnConfig<string>;
export type UsernameConfig = WithValidator<ValueConfig<string>>;
export type UUIDConfig = AsOptional<AsReadOnly<AsHidden<WithValidator<WithNormalizer<ValueConfig<string>>>>>>;
export type VerifiedConfig = WithValidator<ValueConfig<boolean>>;

export type UserConfigs = {
  date_of_birth: DateOfBirthConfig;
  email: EmailConfig;
  email_domain: EmailDomainConfig;
  username: UsernameConfig;
  uuid: UUIDConfig;
  verified: VerifiedConfig;
};

export type UserInterface = EntityInterface<UserConfigs>;

export const UserConfigs:UserConfigs = {
  date_of_birth: {
    value: new Date(0),
    sanitizer: Sanitizers.date,
    validator: (value: Date): boolean => value < new Date(),
  },
  email: {
    value: '',
    sanitizer: Sanitizers.string,
    validator: Validators.email,
  },
  email_domain: {
    fn: function(this: User): string { return this.email.split('@', 2)[1] || '' },
  },
  uuid: {
    value: undefined,
    hidden: true,
    readOnly: true,
    sanitizer: Sanitizers.string,
    normalizer: Normalizers.lowercase,
    validator: Validators.uuid,
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

export class User extends Entity<UserConfigs> implements UserInterface {

  constructor(initialAttrs: EntityConstructorAttrs<UserConfigs> = {}) {
    super(UserConfigs, initialAttrs);
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
