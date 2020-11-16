import { isNegative } from '@typescript-entity/validators';
import { float } from './float';
import type { FloatAttrConfigFactory } from './float';

export type NegativeFloatAttrConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = FloatAttrConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const negativeFloat = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R): NegativeFloatAttrConfigFactory<O, H, R> => ({
  ...float(optional, hidden, immutable),
  validator: isNegative,
});
