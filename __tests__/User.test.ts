import { Config, User } from './User';

const clean = (config: Partial<Config> = {}) => new User('foo@example.com', 'foo', false, config).mergeRaw({
  id: 123,
});

const dirty = (config: Partial<Config> = {}) => new User(true as any, 123 as any, 'abc' as any, config).mergeRaw({
  id: {},
} as any);

test('a User instance can be constructed', () => {

  const user = clean();
  expect(user).toBeInstanceOf(User);

});

test('a User instance can be populated with attributes', () => {

  const user = clean();
  expect(user.email).toBe('foo@example.com');
  expect(user.id).toBe(123);
  expect(user.username).toBe('foo');
  expect(user.verified).toBe(false);

});

test('a User instance can be sanitized', () => {

  const user = dirty();
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

  const user = dirty();

  expect(() => {
    user.validate();
  }).toThrow(TypeError);

});

test('a User instance inherits default configuration', () => {

  const user = clean();
  expect(user.config.minUsernameLength).toBe(5);

});

test('a User instance can override default configuration', () => {

  const user = clean({
    minUsernameLength: 10,
  });

  expect(user.config.minUsernameLength).toBe(10);

});
