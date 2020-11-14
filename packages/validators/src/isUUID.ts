import type { AttrName } from '@typescript-entity/core';
import validator from 'validator';

export interface IsUUIDOptions {
  version?: validator.UUIDVersion;
}

export const isUUID = (value: string, name: AttrName, options: IsUUIDOptions = {}): boolean => (
  validator.isUUID(value, options.version)
);
