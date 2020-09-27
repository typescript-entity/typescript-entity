import { Attrs, InvalidAttrValueError } from '@typescript-entity/core';
import { User, UserConfigs } from './User';

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
    date_of_birth: new Date('2000-01-01'),
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
    date_of_birth: new Date('2000-01-01'),
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

test('an Entity can be filled with read-only attributes later', () => {

  const user = new User();
  user.fill({ uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd' }, true);
  expect(user.uuid).toStrictEqual('7a2d2178-37da-4f5c-bb05-5f6819ff6ecd');

});

test('an Entity cannot be constructed with invalid values', () => {

  expect(() => {
    new User({ username: 'abc' });
  }).toThrow(InvalidAttrValueError);

});

test('an Entity cannot be filled with invalid values later', () => {

  const user = new User();
  expect(() => {
    user.fill({ username: 'abc' });
  }).toThrow(InvalidAttrValueError);

});

test('an Entity can expose all attributes', () => {

  const attrs = {
    date_of_birth: new Date('2000-01-01'),
    email: 'foo@example.com',
    username: 'foobar',
    uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd',
    verified: true,
  };
  const expected = {
    ...attrs,
    email_domain: 'example.com',
  };
  const user = new User(attrs);
  expect(user.all()).toStrictEqual(expected);

});

test('an Entity can expose some attributes', () => {

  const attrs = {
    date_of_birth: new Date('2000-01-01'),
    email: 'foo@example.com',
    username: 'foobar',
    uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd',
    verified: true,
  };
  const expected = {
    username: attrs.username,
    verified: attrs.verified,
  };
  const user = new User(attrs);
  expect(user.some(Object.keys(expected) as (keyof Attrs<UserConfigs>)[])).toStrictEqual(expected);

});

test('an Entity can expose all visible attributes', () => {

  const attrs = {
    date_of_birth: new Date('2000-01-01'),
    email: 'foo@example.com',
    username: 'foobar',
    uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd',
    verified: true,
  };
  const expected = {
    date_of_birth: attrs.date_of_birth,
    email: attrs.email,
    email_domain: 'example.com',
    username: attrs.username,
    verified: attrs.verified,
  };
  const user = new User(attrs);
  expect(user.visible()).toStrictEqual(expected);

});

test('an Entity can expose all hidden attributes', () => {

  const attrs = {
    date_of_birth: new Date('2000-01-01'),
    email: 'foo@example.com',
    username: 'foobar',
    uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd',
    verified: true,
  };
  const expected = {
    uuid: attrs.uuid,
  };
  const user = new User(attrs);
  expect(user.hidden()).toStrictEqual(expected);

});

test('an Entity can expose all visible attributes when cast to string', () => {

  const user = new User({
    date_of_birth: new Date('2000-01-01'),
    email: 'foo@example.com',
    username: 'foobar',
    uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd',
    verified: true,
  });
  expect(String(user)).toStrictEqual(JSON.stringify(user.visible()));
  expect(JSON.stringify(user)).toStrictEqual(String(user));

});

test('an Entity can be filled with values from a JSON string', () => {

  const user = new User({
    date_of_birth: new Date('2000-01-01'),
    email: 'foo@example.com',
    username: 'foobar',
    uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd',
    verified: true,
  });

  const userCopy = (new User()).fillJSON(JSON.stringify(user.all()));
  expect(userCopy.all()).toStrictEqual({
    ...user.all(),
    uuid: undefined,
  });

});

test('an Entity can be filled with read-only values from a JSON string', () => {

  const user = new User({
    date_of_birth: new Date('2000-01-01'),
    email: 'foo@example.com',
    username: 'foobar',
    uuid: '7a2d2178-37da-4f5c-bb05-5f6819ff6ecd',
    verified: true,
  });

  const userCopy = (new User()).fillJSON(JSON.stringify(user.all()), true);
  expect(userCopy.all()).toStrictEqual(user.all());

});
