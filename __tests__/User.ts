import { AttributeConfig, Entity, EntityInterface, InitialAttributes, WithNormalizer, WithReadonly, WithValidator } from '@typescript-entity/core';
import { * as Normalizers } from '@typescript-entity/normalizers';
import { * as Validators } from '@typescript-entity/validators';

export type UserAttributes = {
  date_of_birth: WithNormalizer<WithValidator<AttributeConfig<Date>>>;
  email: WithNormalizer<WithValidator<AttributeConfig<string>>>;
  email_domain: AttributeConfig<() => string>;
  username: WithNormalizer<WithValidator<AttributeConfig<string>>>;
  uuid: WithReadonly<WithNormalizer<WithValidator<AttributeConfig<string | undefined>>>>;
  verified: WithNormalizer<WithValidator<AttributeConfig<boolean>>>;
};

export type UserInterface = EntityInterface<UserAttributes>;

export const ATTRIBUTE_CONFIGS:UserAttributes = {
  date_of_birth: {
    value: new Date(0),
    normalizer: Normalizer.date,
    validator: (value: Date): boolean => value < new Date(),
  },
  email: {
    value: '',
    normalizer: Normalizer.string,
    validator: Validator.email,
  },
  email_domain: {
    value: function(this: User): string { return this.email.split('@', 2)[1] || '' },
  },
  uuid: {
    value: undefined,
    normalizer: Normalizer.lowercase,
    validator: (value: string): boolean => Validator.uuid(value),
    readonly: true,
  },
  username: {
    value: '',
    normalizer: Normalizer.string,
    validator: (value: string): boolean => Validator.string(value, { min: 5 }),
  },
  verified: {
    value: false,
    normalizer: Normalizer.boolean,
    validator: Validator.boolean,
  },
};

export class User extends Entity<UserAttributes> implements UserInterface {

  constructor(initialAttrs: InitialAttributes<UserAttributes> = {}) {
    super(ATTRIBUTE_CONFIGS, initialAttrs);
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
