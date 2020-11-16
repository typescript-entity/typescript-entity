import { boolean, callable, dateInPast, email, string, uuid } from '../packages/configs/src/';
import type { BooleanAttrConfigFactory, CallableAttrConfigFactory, DateInPastAttrConfigFactory, EmailAttrConfigFactory, StringAttrConfigFactory, UUIDAttrConfigFactory } from '../packages/configs/src/';
import { entity } from '../packages/core/src/';
import type { AttrName } from '../packages/core/src/';
import { isLength } from '../packages/validators/src/';

export type UserAttrConfigSet = {
  date_of_birth: DateInPastAttrConfigFactory;
  email: EmailAttrConfigFactory;
  email_domain: CallableAttrConfigFactory<string, true>;
  uuid: UUIDAttrConfigFactory<true, true, true>;
  username: StringAttrConfigFactory<false, false, false, false, true>;
  verified: BooleanAttrConfigFactory<false, false, true>;
};

export type User = InstanceType<typeof User>;

export const UserAttrConfigSet: UserAttrConfigSet = {
  date_of_birth: dateInPast(),
  email: email(),
  email_domain: callable(function(this: User): string | null { return this.email.split('@', 2)[1] || null }),
  uuid: uuid(true, true, true),
  username: {
    ...string(),
    validator: (value: string, name: AttrName): boolean => isLength(value, name, { min: 5 }),
  },
  verified: boolean(false, false, true),
};

export const User = entity(UserAttrConfigSet);
