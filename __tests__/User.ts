import { Config as BaseConfig, Entity, Sanitizers, Validators, sanitizers, validators } from '../src/';

export interface Config extends BaseConfig {
  min_username_length: number,
};

export class User extends Entity<Config> {

  public email: string;
  public id?: number;
  public username: string;
  public verified: boolean;

  static config: Config = {
    ...Entity.config,
    min_username_length: 5,
  };

  static sanitizers: Sanitizers<User> = {
    ...Entity.sanitizers,
    email: (entity, key, value) => sanitizers.string(value),
    id: (entity, key, value) => undefined !== value ? sanitizers.integer(value) : undefined,
    username: (entity, key, value) => sanitizers.string(value),
    verified: (entity, key, value) => sanitizers.boolean(value),
  };

  static validators: Validators<User> = {
    ...Entity.validators,
    email: (entity, key, value) => validators.email(value),
    id: (entity, key, value) => undefined === value || validators.integer(value, {min: 1}),
    username: (entity, key, value) => validators.string(value, {min: entity.config.min_username_length}),
    verified: (entity, key, value) => validators.boolean(value),
  };

  public constructor(email: string, username: string, verified: boolean = false, config: Partial<Config> = {}) {
    super({ ...User.config, ...config as object } as Config);
    this.email = email;
    this.username = username;
    this.verified = verified;
  }

}
