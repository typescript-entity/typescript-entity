import { floor as _floor } from "lodash";

export type FloorOptions = { precision?: number };

export const floor = (value: number, options: FloorOptions = {}): number => _floor(value, options.precision);

