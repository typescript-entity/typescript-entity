import { isURL } from "@typescript-entity/validators";
import type { IsURLOptions } from "@typescript-entity/validators";
import { stringConfig } from "./stringConfig";
import type { StringConfigFactory } from "./stringConfig";

export type URLConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = StringConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export const urlConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R, options: IsURLOptions = {}): URLConfigFactory<O, H, R> => ({
  ...stringConfig(optional, hidden, readOnly),
  validator: (value: string): boolean => isURL(value, options),
});
