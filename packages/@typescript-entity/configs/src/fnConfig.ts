import type { FnConfig, ResolvedValue, Value, ValueFn } from "@typescript-entity/core";

export type FnConfigFactory<
  V extends Value,
  Optional extends boolean = false,
  Hidden extends boolean = false
> = (
  Pick<FnConfig<ResolvedValue<V, Optional>>, "value">
  & (Hidden extends true ? { hidden: true } : { hidden?: false })
);

export const fnConfig = <
  V extends ValueFn,
  O extends boolean = false,
  H extends boolean = false,
>(value: V, optional?: O, hidden?: H): FnConfigFactory<ReturnType<V>, O, H> => ({
  hidden,
  value,
} as unknown as FnConfigFactory<ReturnType<V>, O, H>);
