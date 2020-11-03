import type { Fn, FnConfig, Value } from "@typescript-entity/core";
import type { ResolvedValue } from "./ConfigFactory";

export type FnConfigFactory<
  T extends Value,
  Optional extends boolean = false,
  Hidden extends boolean = false
> = (
  Pick<FnConfig<ResolvedValue<T, Optional>>, "fn">
  & (Hidden extends true ? { hidden: true } : { hidden?: false })
);

export const fnConfig = <
  T extends Fn,
  O extends boolean = false,
  H extends boolean = false,
>(fn: T, optional?: O, hidden?: H): FnConfigFactory<ReturnType<T>, O, H> => ({
  hidden,
  fn,
} as unknown as FnConfigFactory<ReturnType<T>, O, H>);
