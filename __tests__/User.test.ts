import { User } from './User';
import { FunctionAttributeError, InvalidAttributeError, ReadonlyAttributeError } from '../src/Error';

test('an entity can be constructed with default values', () => {

  const user = new User();
  expect(user).toBeInstanceOf(User);
  expect(user.date_of_birth).toBeInstanceOf(Date);
  expect(user.date_of_birth!.toISOString()).toBe('1970-01-01T00:00:00.000Z');
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
  expect(user.date_of_birth!.toISOString()).toBe('2000-01-01T00:00:00.000Z');
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
  expect(user.date_of_birth!.toISOString()).toBe('2000-01-01T00:00:00.000Z');
  expect(user.email).toBe('foo@example.com');
  expect(user.email_domain).toBe('example.com');
  expect(user.username).toBe('foobar');
  expect(user.verified).toBe(true);

});

test('an entity cannot be filled with readonly values later', () => {

  const user = new User();
  expect(() => {
    user.fill({
      uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd',
    } as any);
  }).toThrow(ReadonlyAttributeError);

});

test('an entity cannot be constructed with values for dynamic attributes', () => {

  expect(() => {
    new User({
      email_domain: 'foo.com',
    } as any);
  }).toThrow(FunctionAttributeError);

});

test('an entity cannot be filled with values for dynamic attributes later', () => {

  const user = new User();
  expect(() => {
    user.fill({
      email_domain: 'foo.com',
    } as any);
  }).toThrow(FunctionAttributeError);

});

test('an entity cannot be filled with invalid values later', () => {

  const user = new User();
  expect(() => {
    user.fill({
      username: 'abc',
    });
  }).toThrow(InvalidAttributeError);

});
