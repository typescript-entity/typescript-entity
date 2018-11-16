import { Config, Modelable } from './interfaces';
import Model from './Model';

export type Attributes<M extends Model<C>, C extends Config = M['config']> = NonFunctionProperties<NonModelProperties<M>>;

export type Constructor<M extends Model<C>, C extends Config> = Function & {
  config: C;
  sanitizers: Sanitizers<M>;
  validators: Sanitizers<M>;
};

export type Sanitizers<M extends Model<C>, C extends Config = M['config'], A = Attributes<M>> = {
  [K in keyof A]: (model: Modelable<C>, key: K, value: any) => A[K];
};

export type Validators<M extends Model<C>, C extends Config = M['config'], A = Attributes<M>> = {
  [K in keyof A]: (model: Modelable<C>, key: K, value: A[K]) => boolean;
};

type NonModelProperties<M extends Model<C>, C extends Config = M['config']> = Pick<M, Exclude<keyof M, keyof Model>>;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
