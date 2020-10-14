import { isNegative } from "@typescript-entity/validators";
import { integerConfig } from "./integerConfig";
import type { IntegerConfigFactory } from "./integerConfig";

export type NegativeIntegerConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = IntegerConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export const negativeIntegerConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): NegativeIntegerConfigFactory<O, H, R> => ({
  ...integerConfig(optional, hidden, readOnly),
  validator: isNegative,
});
