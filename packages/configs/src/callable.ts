import type { AttrValue, CallableAttrConfig, Fn } from '@typescript-entity/core';
import type { ResolveValue } from './writable';

export type CallableAttrConfigFactory<
  V extends AttrValue,
  Optional extends boolean = false,
  Hidden extends boolean = false
> = (
  Pick<CallableAttrConfig<ResolveValue<V, Optional>>, 'fn'>
  & (Hidden extends true ? { hidden: true } : { hidden?: false })
);

export const callable = <
  F extends Fn<AttrValue>,
  H extends boolean = false,
>(fn: F, hidden?: H): CallableAttrConfigFactory<ReturnType<F>, ReturnType<F> extends null ? true : false, H> => ({
  hidden,
  fn,
} as unknown as CallableAttrConfigFactory<ReturnType<F>, ReturnType<F> extends null ? true : false, H>);
