import { isNegative } from '@typescript-entity/validators';
import { number } from './number';
import type { NumberAttrConfigFactory } from './number';

export type NegativeNumberAttrConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = NumberAttrConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const negativeNumber = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R): NegativeNumberAttrConfigFactory<O, H, R> => ({
  ...number(optional, hidden, immutable),
  validator: isNegative,
});
