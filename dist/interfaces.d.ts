import { Config } from './types';
export interface Configurable<C extends Config> {
    config: C;
}
export interface Sanitizable {
    sanitize: () => this;
    sanitizeValue: (key: any, value: any) => any;
}
export interface Validatable {
    validate: () => this;
    validateValue: (key: any, value: any) => true;
}
export interface Modelable<C extends Config> extends Configurable<C>, Sanitizable, Validatable {
}
