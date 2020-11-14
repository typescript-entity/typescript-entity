import type { AttrValue, Fn } from '@typescript-entity/core';
import type { CallableAttrConfigFactory } from './AttrConfigFactory';

export const callableConfig = <
  F extends Fn<AttrValue>,
  H extends boolean = false,
>(fn: F, hidden?: H): CallableAttrConfigFactory<ReturnType<F>, ReturnType<F> extends null ? true : false, H> => ({
  hidden,
  fn,
} as unknown as CallableAttrConfigFactory<ReturnType<F>, ReturnType<F> extends null ? true : false, H>);
