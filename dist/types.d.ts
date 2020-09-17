import { Config } from './Config';
import { Entityable } from './Entityable';
import { Entity } from './Entity';
export declare type Attributes<E extends Entity<C>, C extends Config = E['config']> = NonFunctionProperties<NonEntityProperties<E>>;
export declare type Constructor<E extends Entity<C>, C extends Config> = Function & {
    config: C;
    sanitizers: Sanitizers<E>;
    validators: Validators<E>;
};
export declare type Sanitizers<E extends Entity<C>, C extends Config = E['config'], A = Attributes<E>> = {
    [K in keyof A]: (entity: Entityable<C>, key: K, value: any) => A[K];
};
export declare type Validators<E extends Entity<C>, C extends Config = E['config'], A = Attributes<E>> = {
    [K in keyof A]: (entity: Entityable<C>, key: K, value: A[K]) => boolean;
};
declare type NonEntityProperties<E extends Entity<C>, C extends Config = E['config']> = Pick<E, Exclude<keyof E, keyof Entity>>;
declare type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
declare type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
export {};
