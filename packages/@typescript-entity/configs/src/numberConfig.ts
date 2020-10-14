import type { ConfigFactory } from "./ConfigFactory";
import { toNumber, toString } from "@typescript-entity/sanitizers";

export type NumberConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = ConfigFactory<number, Optional, Hidden, ReadOnly, Normalizer, Validator>;

export const numberConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): NumberConfigFactory<O, H, R> => ({
  ...numberConfig(optional, hidden, readOnly),
  sanitizer: (
    optional
      ? (value: unknown): number | undefined => toString(value) ? toNumber(value) : undefined
      : toNumber
  ),
} as unknown as NumberConfigFactory<O, H, R>);
