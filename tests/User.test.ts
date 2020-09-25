import { AttrReadOnlyError, AttrUnregisteredError, AttrValueFnError, AttrValueInvalidError } from '@typescript-entity/core';
import { User } from './User';

test('an Entity can be constructed with default values', () => {

  const user = new User();
  expect(user).toBeInstanceOf(User);
  expect(user.date_of_birth).toBeInstanceOf(Date);
  expect(user.date_of_birth.toISOString()).toStrictEqual('1970-01-01T00:00:00.000Z');
  expect(user.email).toStrictEqual('');
  expect(user.email_domain).toStrictEqual('');
  expect(user.username).toStrictEqual('');
  expect(user.uuid).toStrictEqual(undefined);
  expect(user.verified).toStrictEqual(false);

});

test('an Entity can be constructed with custom values', () => {

  const user = new User({
    date_of_birth: '2000-01-01',
    email: 'foo@example.com',
    username: 'foobar',
    uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd',
    verified: true,
  });
  expect(user.date_of_birth).toBeInstanceOf(Date);
  expect(user.date_of_birth.toISOString()).toStrictEqual('2000-01-01T00:00:00.000Z');
  expect(user.email).toStrictEqual('foo@example.com');
  expect(user.email_domain).toStrictEqual('example.com');
  expect(user.username).toStrictEqual('foobar');
  expect(user.uuid).toStrictEqual('7a2d2178-37da-4f5c-bb05-5f6819ff6ecd');
  expect(user.verified).toStrictEqual(true);

});

test('an Entity can be filled with custom values later', () => {

  const user = new User();
  user.fill({
    date_of_birth: '2000-01-01',
    email: 'foo@example.com',
    username: 'foobar',
    verified: true,
  });
  expect(user.date_of_birth).toBeInstanceOf(Date);
  expect(user.date_of_birth.toISOString()).toStrictEqual('2000-01-01T00:00:00.000Z');
  expect(user.email).toStrictEqual('foo@example.com');
  expect(user.email_domain).toStrictEqual('example.com');
  expect(user.username).toStrictEqual('foobar');
  expect(user.verified).toStrictEqual(true);

});

test('an Entity cannot be filled with invalid values later', () => {

  const user = new User();
  expect(() => {
    user.fill({ username: 'abc' });
  }).toThrow(AttrValueInvalidError);

});

test('an Entity cannot be constructed with values for unregistered attributes', () => {

  expect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new User({ foo: 'bar' } as any);
  }).toThrow(AttrUnregisteredError);

});

test('an Entity cannot be filled with values for unregistered attributes later', () => {

  const user = new User();
  expect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user.fill({ foo: 'bar' } as any);
  }).toThrow(AttrUnregisteredError);

});

test('an Entity cannot be have values set for non-writable attributes', () => {

  const user = new User();
  expect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user.set('uuid' as any, '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd');
  }).toThrow(AttrReadOnlyError);
  expect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user.set('email_domain' as any, 'google.com');
  }).toThrow(AttrValueFnError);

});

test('an Entity can be filled with values for non-writable attributes without error', () => {

  const user = new User({ uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd' });
  const originalUuid = user.uuid;
  const originalEmailDomain = user.email_domain;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user.fill({ uuid: '6290be99-deef-4229-8ee0-250fc893d07f', email_domain: 'google.com' } as any);
  expect(user.uuid).toStrictEqual(originalUuid);
  expect(user.email_domain).toStrictEqual(originalEmailDomain);

});

test('an Entity can expose all attributes', () => {

  const user = new User();
  expect(Object.keys(user.all())).not.toStrictEqual([ 'date_of_birth', 'email', 'email_domain', 'username', 'uuid', 'verified' ]);

});

test('an Entity can expose all visible attributes', () => {

  const user = new User();
  expect(Object.keys(user.visible())).toStrictEqual([ 'date_of_birth', 'email', 'email_domain', 'username', 'verified' ]);

});

test('an Entity can expose all hidden attributes', () => {

  const user = new User();
  expect(Object.keys(user.hidden())).toStrictEqual([ 'uuid' ]);

});

test('an Entity must expose only visible attributes in JSON form', () => {

  const user = new User();
  expect(JSON.stringify(user)).toStrictEqual(JSON.stringify(user.visible()));

});

test('an Entity can be cast to a JSON string', () => {

  const user = new User();
  expect(String(user)).toStrictEqual(JSON.stringify(user.toJSON()));

});
