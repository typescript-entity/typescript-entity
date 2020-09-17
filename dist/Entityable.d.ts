import { Config } from './Config';
import { Configurable } from './Configurable';
import { Sanitizable } from './Sanitizable';
import { Validatable } from './Validatable';
export interface Entityable<C extends Config> extends Configurable<C>, Sanitizable, Validatable {
}
