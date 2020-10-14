import validator from "validator";

export type IsUUIDOptions = {
  version?: validator.UUIDVersion;
};

export const isUUID = (value: string, options: IsUUIDOptions = {}): boolean => (
  validator.isUUID(value, options.version)
);
