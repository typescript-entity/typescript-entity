import { isPositive } from '@typescript-entity/validators';
import { float } from './float';
import type { FloatAttrConfigFactory } from './float';

export type PositiveFloatAttrConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = FloatAttrConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const positiveFloat = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R): PositiveFloatAttrConfigFactory<O, H, R> => ({
  ...float(optional, hidden, immutable),
  validator: isPositive,
});
