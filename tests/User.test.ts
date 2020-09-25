import { AttrReadonlyError, AttrUnregisteredError, AttrValueFnError, AttrValueInvalidError } from '@typescript-entity/core';
import { User } from './User';

test('an entity can be constructed with default values', () => {

  const user = new User();
  expect(user).toBeInstanceOf(User);
  expect(user.date_of_birth).toBeInstanceOf(Date);
  expect(user.date_of_birth.toISOString()).toBe('1970-01-01T00:00:00.000Z');
  expect(user.email).toBe('');
  expect(user.email_domain).toBe('');
  expect(user.username).toBe('');
  expect(user.uuid).toBe(undefined);
  expect(user.verified).toBe(false);

});

test('an entity can be constructed with custom values', () => {

  const user = new User({
    date_of_birth: '2000-01-01',
    email: 'foo@example.com',
    username: 'foobar',
    uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd',
    verified: true,
  });
  expect(user.date_of_birth).toBeInstanceOf(Date);
  expect(user.date_of_birth.toISOString()).toBe('2000-01-01T00:00:00.000Z');
  expect(user.email).toBe('foo@example.com');
  expect(user.email_domain).toBe('example.com');
  expect(user.username).toBe('foobar');
  expect(user.uuid).toBe('7a2d2178-37da-4f5c-bb05-5f6819ff6ecd');
  expect(user.verified).toBe(true);

});

test('an entity can be filled with custom values later', () => {

  const user = new User();
  user.fill({
    date_of_birth: '2000-01-01',
    email: 'foo@example.com',
    username: 'foobar',
    verified: true,
  });
  expect(user.date_of_birth).toBeInstanceOf(Date);
  expect(user.date_of_birth.toISOString()).toBe('2000-01-01T00:00:00.000Z');
  expect(user.email).toBe('foo@example.com');
  expect(user.email_domain).toBe('example.com');
  expect(user.username).toBe('foobar');
  expect(user.verified).toBe(true);

});

test('an entity cannot be filled with readonly values later', () => {

  const user = new User();
  expect(() => {
    user.fill({ uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd' });
  }).toThrow(AttrReadonlyError);

});

test('an entity cannot be constructed with values for function attributes', () => {

  expect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new User({ email_domain: 'foo.com' } as any);
  }).toThrow(AttrValueFnError);

});

test('an entity cannot be filled with values for function attributes later', () => {

  const user = new User();
  expect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user.fill({ email_domain: 'foo.com' } as any);
  }).toThrow(AttrValueFnError);

});

test('an entity cannot be filled with invalid values later', () => {

  const user = new User();
  expect(() => {
    user.fill({ username: 'abc' });
  }).toThrow(AttrValueInvalidError);

});

test('an entity cannot be constructed with values for unregistered attributes', () => {

  expect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new User({ foo: 'bar' } as any);
  }).toThrow(AttrUnregisteredError);

});

test('an entity cannot be filled with values for unregistered attributes later', () => {

  const user = new User();
  expect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user.fill({ foo: 'bar' } as any);
  }).toThrow(AttrUnregisteredError);

});

test('an entity can be exported as JSON', () => {

  const user = new User();
  const attrs = user.all();
  expect(JSON.stringify(user)).toBe(JSON.stringify(attrs));
  expect(String(user)).toBe(JSON.stringify(attrs));

});
