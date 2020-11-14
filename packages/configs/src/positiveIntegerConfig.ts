import { isPositive } from '@typescript-entity/validators';
import { integerConfig } from './integerConfig';
import type { IntegerConfigFactory } from './integerConfig';

export type PositiveIntegerConfigFactory<
  Optional extends boolean = false,
  Hidden extends boolean = false,
  Immutable extends boolean = false,
  Normalizer extends boolean = false
> = IntegerConfigFactory<Optional, Hidden, Immutable, Normalizer, true>;

export const positiveIntegerConfig = <
  O extends boolean = false,
  H extends boolean = false,
  R extends boolean = false
>(optional?: O, hidden?: H, immutable?: R): PositiveIntegerConfigFactory<O, H, R> => ({
  ...integerConfig(optional, hidden, immutable),
  validator: isPositive,
});
