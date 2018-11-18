import { Attributes, Model, Config as BaseConfig, Sanitizers, Validators, sanitizers, validators } from '../src/';

export interface Config extends BaseConfig {
  min_username_length: number,
};

export class User extends Model<Config> {

  public email!: string;
  public id?: number;
  public username!: string;
  public verified!: boolean;

  static config: Config = {
    ...Model.config,
    min_username_length: 5,
  };

  static sanitizers: Sanitizers<User> = {
    ...Model.sanitizers,
    email: (model, key, value) => sanitizers.string(value),
    id: (model, key, value) => undefined !== value ? sanitizers.integer(value) : undefined,
    username: (model, key, value) => sanitizers.string(value),
    verified: (model, key, value) => sanitizers.boolean(value),
  };

  static validators: Validators<User> = {
    ...Model.validators,
    email: (model, key, value) => validators.email(value),
    id: (model, key, value) => undefined === value || validators.integer(value, {min: 1}),
    username: (model, key, value) => validators.string(value, {min: model.config.min_username_length}),
    verified: (model, key, value) => validators.boolean(value),
  };

  public constructor(attrs: Attributes<User>, config: Partial<Config> = {}, raw: boolean = false) {
    super(attrs, { ...User.config, ...config as object } as Config, raw);
  }

}
