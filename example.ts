import { boolean, callable, dateInPast, email, string, uuid } from '@typescript-entity/configs';
import { entity } from '@typescript-entity/core';
import type { AttrName } from '@typescript-entity/core';
import { isLength } from '@typescript-entity/validators';

class User extends entity({
  date_of_birth: dateInPast(), // Will be sanitized to a Date, and validated as a date in the past
  email: email(), // Will be sanitized to a string and validated as... y'know
  email_domain: callable(function(this: User): string | null {
    return this.email.split('@', 2)[1] || null; // Return the email domain (or null)
  }),
  uuid: uuid(true, true, true), // Optional, Immutable (read-only), Hidden (from JSON output)
  username: {
    ...string(),
    validator: (value: string, name: AttrName): boolean => {
      return isLength(value, name, { min: 5 }); // Username must be at least 5 chars
    },
  },
  verified: boolean(false, false, true), // Required, Mutable, Hidden
}) {}


// Let's see that in action...


const user = new User({
  uuid: 'some-uuid-from-datastore', // Immutable attributes can only be set during instantiation
  verified: true, // Mutable attributes can be provided too, though
});

user.username = 'foobar'; // Values will always be sanitized, normalized and validated

user.username = 'abc'; // Throws a ValidationError (username is too short)

user.email = 123; // ‼️ RED SQUIGGLES ‼️ Email attribute must be a string

user
  .set('email', 'foo@bar.com') // Let's chain that...
  .set('uuid', 'this-attribute-is-immutable'); // ‼️ RED SQUIGGLES ‼️

// Set multiple attributes at once...
user.fill({
  email: 'foo@bar.com',
  email_domain: 'a value on a callable?', // 💥BANG💥
});

user.wtf_is_this = 'I dunno... have some RED SQUIGGLES!';

const attrs = user.many([ 'email', 'uuid' ]);
console.log(attrs.email);
console.log(attrs.username); // Didn't ask for 'username' when calling many()

console.log(user.all()); // Dump all attribute values

const json = JSON.stringify(user); // Export all visible attributes as JSON

new User(json); // Instances can be created from JSON or other Entity instances too
