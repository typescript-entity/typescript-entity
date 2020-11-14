import { round as _round } from 'lodash';

export type RoundOptions = { precision?: number };

export const round = (value: number, name: string, options: RoundOptions = {}): number => (
  _round(value, options.precision)
);
