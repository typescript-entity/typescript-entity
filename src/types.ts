import { Config } from './Config';
import { Entityable } from './Entityable';
import { Entity } from './Entity';

export type Attributes<E extends Entity<C>, C extends Config = E['config']> = NonFunctionProperties<NonEntityProperties<E>>;

export type Constructor<E extends Entity<C>, C extends Config> = Function & {
  config: C;
  sanitizers: Sanitizers<E>;
  validators: Validators<E>;
};

export type Sanitizers<E extends Entity<C>, C extends Config = E['config'], A = Attributes<E>> = {
  [K in keyof A]: (entity: Entityable<C>, key: K, value: any) => A[K];
};

export type Validators<E extends Entity<C>, C extends Config = E['config'], A = Attributes<E>> = {
  [K in keyof A]: (entity: Entityable<C>, key: K, value: A[K]) => boolean;
};

type NonEntityProperties<E extends Entity<C>, C extends Config = E['config']> = Pick<E, Exclude<keyof E, keyof Entity>>;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
