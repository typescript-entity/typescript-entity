import { AttributeConfig, Entity, EntityInterface, InitialAttributes, Normalizer, Validator, WithNormalizer, WithReadonly, WithValidator } from '../src/';

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
    validator: (value) => value < new Date(),
  },
  email: {
    value: '',
    normalizer: Normalizer.string,
    validator: Validator.email,
  },
  email_domain: {
    value: function(this: User) { return this.email.split('@', 2)[1] || '' },
  },
  uuid: {
    value: undefined,
    normalizer: Normalizer.lowercase,
    validator: (value) => Validator.uuid(value),
    readonly: true,
  },
  username: {
    value: '',
    normalizer: Normalizer.string,
    validator: (value) => Validator.string(value, { min: 5 }),
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

  get date_of_birth() {
    return this.get('date_of_birth');
  }

  set date_of_birth(value) {
    this.set('date_of_birth', value);
  }

  get email() {
    return this.get('email');
  }

  set email(value) {
    this.set('email', value);
  }

  get email_domain() {
    return this.get('email_domain');
  }

  get uuid() {
    return this.get('uuid');
  }

  get username() {
    return this.get('username');
  }

  set username(value) {
    this.set('username', value);
  }

  get verified() {
    return this.get('verified');
  }

  set verified(value) {
    this.set('verified', value);
  }

};
