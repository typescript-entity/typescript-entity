import { trim as _trim } from 'lodash';

export type TrimOptions = { chars?: string };

export const trim = (value: string, name: string, options: TrimOptions = {}): string => (
  _trim(value, options.chars)
);
