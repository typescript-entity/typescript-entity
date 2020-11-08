import { toFloat, toString } from '@typescript-entity/sanitizers';
import { numberConfig } from './numberConfig';
import type { NumberConfigFactory } from './numberConfig';

export type FloatConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false,
  Validator extends boolean = false
> = NumberConfigFactory<Optional, Hidden, ReadOnly, Normalizer, Validator>;

export const floatConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): FloatConfigFactory<O, H, R> => ({
  ...numberConfig(optional, hidden, readOnly),
  sanitizer: (
    optional
      ? (value: unknown): number | undefined => toString(value) ? toFloat(value) : undefined
      : toFloat
  ),
} as unknown as FloatConfigFactory<O, H, R>);
