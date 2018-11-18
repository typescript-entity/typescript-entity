import { Config, User } from './User';

const clean = (config: Partial<Config> = {}, raw: boolean = false) => new User(
  {
    email: 'foo@example.com',
    id: 123,
    username: 'foo',
    verified: false,
  },
  config,
  raw
);

const dirty = (config: Partial<Config> = {}, raw: boolean = false) => new User(
  {
    email: true,
    id: {},
    username: 123,
    verified: 'abc',
  } as any,
  config,
  raw
);

test('a User instance can be constructed', () => {

  const user = clean({}, true);
  expect(user).toBeInstanceOf(User);

});

test('a User instance can be populated with attributes', () => {

  const user = clean({}, true);
  expect(user.email).toBe('foo@example.com');
  expect(user.id).toBe(123);
  expect(user.username).toBe('foo');
  expect(user.verified).toBe(false);

});

test('a User instance can be sanitized', () => {

  const user = dirty({}, true);
  expect(typeof user.email).toBe('boolean');
  expect(typeof user.id).toBe('object');
  expect(typeof user.username).toBe('number');
  expect(typeof user.verified).toBe('string');

  user.sanitize();
  expect(typeof user.email).toBe('string');
  expect(typeof user.id).toBe('number');
  expect(typeof user.username).toBe('string');
  expect(typeof user.verified).toBe('boolean');

});

test('a User instance can be validated', () => {

  const user = dirty({}, true);
  expect(() => { user.validate() }).toThrow(TypeError);

});

test('a User instance inherits default configuration', () => {

  const user = clean({}, true);
  expect(user.config.min_username_length).toBe(5);

});

test('a User instance can override default configuration', () => {

  const user = clean({ min_username_length: 10 }, true);
  expect(user.config.min_username_length).toBe(10);

});
