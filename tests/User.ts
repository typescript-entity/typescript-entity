import { booleanConfig, dateInPastConfig, emailConfig, fnConfig, stringConfig, uuidConfig } from "@typescript-entity/configs";
import type { BooleanConfigFactory, DateInPastConfigFactory, EmailConfigFactory, FnConfigFactory, StringConfigFactory, UUIDConfigFactory } from "@typescript-entity/configs";
import { Entity } from "@typescript-entity/core";
import type { Attr, Attrs, WritableAttrs } from "@typescript-entity/core";
import { isLength } from "@typescript-entity/validators";

export type DateOfBirthConfig = DateInPastConfigFactory;

export type EmailConfig = EmailConfigFactory;

export type EmailDomainConfig = FnConfigFactory<string, true>;

export type UUIDConfig = UUIDConfigFactory<true, true, true>;

export type UsernameConfig = StringConfigFactory<false, false, false, false, true>;

export type VerifiedConfig = BooleanConfigFactory;

export type Configs = {
  date_of_birth: DateOfBirthConfig;
  email: EmailConfig;
  email_domain: EmailDomainConfig;
  uuid: UUIDConfig;
  username: UsernameConfig;
  verified: VerifiedConfig;
};

export const CONFIGS: Configs = {
  date_of_birth: dateInPastConfig(),
  email: emailConfig(),
  email_domain: fnConfig(function(this: User): string | undefined { return this.email.split("@", 2)[1] || undefined }, true),
  uuid: uuidConfig(true, true, true),
  username: {
    ...stringConfig(),
    validator: (value: string): boolean => isLength(value, { min: 5 }),
  },
  verified: booleanConfig(),
};

export class User extends Entity<Configs> implements Attrs<Configs> {

  constructor(attrs: Partial<WritableAttrs<Configs, true>> = {}) {
    super(CONFIGS, attrs);
  }

  get date_of_birth(): Attr<Configs["date_of_birth"]> {
    return this.one("date_of_birth");
  }

  set date_of_birth(value: Attr<Configs["date_of_birth"]>) {
    this.set("date_of_birth", value);
  }

  get email(): Attr<Configs["email"]> {
    return this.one("email");
  }

  set email(value: Attr<Configs["email"]>) {
    this.set("email", value);
  }

  get email_domain(): Attr<Configs["email_domain"]> {
    return this.one("email_domain");
  }

  get uuid(): Attr<Configs["uuid"]> {
    return this.one("uuid");
  }

  get username(): Attr<Configs["username"]> {
    return this.one("username");
  }

  set username(value: Attr<Configs["username"]>) {
    this.set("username", value);
  }

  get verified(): Attr<Configs["verified"]> {
    return this.one("verified");
  }

  set verified(value: Attr<Configs["verified"]>) {
    this.set("verified", value);
  }

}
