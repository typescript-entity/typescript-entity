import { AttrConfig, AttrInitialValues, Entity, EntityInterface } from '@typescript-entity/core';
import * as Normalizers from '@typescript-entity/normalizers';
import * as Validators from '@typescript-entity/validators';

export type UserAttrConfigs = {
  date_of_birth: AttrConfig<Date>;
  email: AttrConfig<string>;
  email_domain: AttrConfig<() => string>;
  username: AttrConfig<string>;
  uuid: AttrConfig<string | undefined>;
  verified: AttrConfig<boolean>;
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
    normalizer: Normalizers.lowercase,
    validator: (value: string): boolean => Validators.uuid(value),
    readonly: true,
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
