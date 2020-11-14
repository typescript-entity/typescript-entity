import { ceil as _ceil } from 'lodash';

export type CeilOptions = { precision?: number };

export const ceil = (value: number, name: string, options: CeilOptions = {}): number => (
  _ceil(value, options.precision)
);
