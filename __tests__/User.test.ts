import InvalidAttributeError from '../src/InvalidAttributeError';
import NonwritableAttributeError from '../src/NonwritableAttributeError';
import { UserEntity } from './User';

test('an entity can be constructed with default values', () => {

  const user = new UserEntity();
  expect(user).toBeInstanceOf(UserEntity);
  expect(user.attr('email')).toBe('');
  expect(user.attr('email_domain')).toBe(undefined);
  expect(user.attr('username')).toBe('');
  expect(user.attr('uuid')).toBe(undefined);
  expect(user.attr('verified')).toBe(false);

});

test('an entity can be constructed with custom values', () => {

  const user = new UserEntity({
    email: 'foo@example.com',
    username: 'foobar',
    uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd',
    verified: true,
  });
  expect(user.attr('email')).toBe('foo@example.com');
  expect(user.attr('email_domain')).toBe('example.com');
  expect(user.attr('username')).toBe('foobar');
  expect(user.attr('uuid')).toBe('7a2d2178-37da-4f5c-bb05-5f6819ff6ecd');
  expect(user.attr('verified')).toBe(true);

});

test('an entity can be filled with custom values later', () => {

  const user = new UserEntity();
  user.fill({
    email: 'foo@example.com',
    username: 'foobar',
    verified: true,
  });
  expect(user.attr('email')).toBe('foo@example.com');
  expect(user.attr('email_domain')).toBe('example.com');
  expect(user.attr('username')).toBe('foobar');
  expect(user.attr('verified')).toBe(true);

});

test('an entity cannot be filled with readonly values later', () => {

  const user = new UserEntity();
  expect(() => {
    user.fill({
      uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd',
    });
  }).toThrow(NonwritableAttributeError);

});

test('an entity cannot be constructed with values for dynamic attributes', () => {

  expect(() => {
    new UserEntity({
      email_domain: 'foo.com',
    });
  }).toThrow(NonwritableAttributeError);

});

test('an entity cannot be filled with values for dynamic attributes later', () => {

  const user = new UserEntity();
  expect(() => {
    user.fill({
      email_domain: 'foo.com',
    });
  }).toThrow(NonwritableAttributeError);

});

test('an entity cannot be filled with invalid values later', () => {

  const user = new UserEntity();
  expect(() => {
    user.fill({
      username: 'abc',
    });
  }).toThrow(InvalidAttributeError);

});
