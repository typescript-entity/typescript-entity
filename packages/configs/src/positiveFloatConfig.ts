import { isPositive } from '@typescript-entity/validators';
import { floatConfig } from './floatConfig';
import type { FloatConfigFactory } from './floatConfig';

export type PositiveFloatConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  ReadOnly extends boolean = false,
  Normalizer extends boolean = false
> = FloatConfigFactory<Optional, Hidden, ReadOnly, Normalizer, true>;

export const positiveFloatConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, readOnly?: R): PositiveFloatConfigFactory<O, H, R> => ({
  ...floatConfig(optional, hidden, readOnly),
  validator: isPositive,
});
