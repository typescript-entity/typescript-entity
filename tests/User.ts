import { AsHidden, AsOptional, AsReadOnly, AttrConfig, AttrInitialValues, Entity, EntityInterface, WithNormalizer, WithValidator } from '@typescript-entity/core';
import * as Normalizers from '@typescript-entity/normalizers';
import * as Validators from '@typescript-entity/validators';

export type DateOfBirthAttrConfig = WithValidator<WithNormalizer<AttrConfig<Date>>>;
export type EmailAttrConfig = WithValidator<WithNormalizer<AttrConfig<string>>>;
export type EmailDomainAttrConfig = AttrConfig<() => string>;
export type UsernameAttrConfig = WithValidator<WithNormalizer<AttrConfig<string>>>;
export type UUIDAttrConfig = AsOptional<AsReadOnly<AsHidden<WithValidator<WithNormalizer<AttrConfig<string>>>>>>;
// TODO: export type VerifiedAttrConfig = WithValidator<WithNormalizer<AttrConfig<boolean>>>;
export type VerifiedAttrConfig = WithValidator<AttrConfig<boolean>>;

export type UserAttrConfigs = {
  date_of_birth: DateOfBirthAttrConfig;
  email: EmailAttrConfig;
  email_domain: EmailDomainAttrConfig;
  username: UsernameAttrConfig;
  uuid: UUIDAttrConfig;
  verified: VerifiedAttrConfig;
};

export type UserInterface = EntityInterface<UserAttrConfigs>;

export const USER_ATTR_CONFIGS:UserAttrConfigs = {
  date_of_birth: {
    value: new Date(0),
    normalizer: Normalizers.date,
    validator: (value: Date): boolean => value < new Date(),
  },
  email: {
    value: '',
    normalizer: Normalizers.string,
    validator: Validators.email,
  },
  email_domain: {
    value: function(this: User): string { return this.email.split('@', 2)[1] || '' },
  },
  uuid: {
    value: undefined,
    hidden: true,
    readOnly: true,
    normalizer: Normalizers.lowercase,
    validator: Validators.uuid,
  },
  username: {
    value: '',
    normalizer: Normalizers.string,
    validator: (value: string): boolean => Validators.string(value, { min: 5 }),
  },
  verified: {
    value: false,
    // TODO: normalizer: Normalizers.boolean,
    validator: Validators.boolean,
  },
};

export class User extends Entity<UserAttrConfigs> implements UserInterface {

  constructor(initialAttrs: AttrInitialValues<UserAttrConfigs> = {}) {
    super(USER_ATTR_CONFIGS, initialAttrs);
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
