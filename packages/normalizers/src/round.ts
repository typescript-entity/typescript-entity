import { round as _round } from 'lodash';

export type RoundOptions = { precision?: number };

export const round = (value: number, options: RoundOptions = {}): number => _round(value, options.precision);
