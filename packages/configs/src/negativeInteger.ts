import { isNegative } from '@typescript-entity/validators';
import { integer } from './integer';
import type { IntegerAttrConfigFactory } from './integer';

export type NegativeIntegerAttrConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = IntegerAttrConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const negativeInteger = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R): NegativeIntegerAttrConfigFactory<O, H, R> => ({
  ...integer(optional, hidden, immutable),
  validator: isNegative,
});
