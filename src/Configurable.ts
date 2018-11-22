import { Config } from './Config';

export interface Configurable<C extends Config> {
  config: C;
}
