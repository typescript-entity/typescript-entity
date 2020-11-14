import { floor as _floor } from 'lodash';

export type FloorOptions = { precision?: number };

export const floor = (value: number, name: string, options: FloorOptions = {}): number => (
  _floor(value, options.precision)
);
