import validator from 'validator';

export interface IsUUIDOptions {
  version?: validator.UUIDVersion;
}

export const isUUID = (value: string, options: IsUUIDOptions = {}): boolean => (
  validator.isUUID(value, options.version)
);
