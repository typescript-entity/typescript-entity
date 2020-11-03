import type { FnConfig, StaticValue, FnValue } from "@typescript-entity/core";
import type { ResolvedStaticValue } from "./ConfigFactory";

export type FnConfigFactory<
  T extends StaticValue,
  Optional extends boolean = false,
  Hidden extends boolean = false
> = (
  Pick<FnConfig<ResolvedStaticValue<T, Optional>>, "value">
  & (Hidden extends true ? { hidden: true } : { hidden?: false })
);

export const fnConfig = <
  V extends FnValue,
  O extends boolean = false,
  H extends boolean = false,
>(value: V, optional?: O, hidden?: H): FnConfigFactory<ReturnType<V>, O, H> => ({
  hidden,
  value,
} as unknown as FnConfigFactory<ReturnType<V>, O, H>);
